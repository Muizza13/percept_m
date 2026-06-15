import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod/v3";
import { zodToJsonSchema } from "zod-to-json-schema";
import { slideAnalysisSchema } from "@/lib/insights";

export const runtime = "nodejs";
export const maxDuration = 60;

const GEMINI_MODEL = "gemini-3.5-flash";
const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
const PNG_DATA_URL_PREFIX = /^data:image\/png;base64,/;

const requestSchema = z.object({
  imageBase64: z.string().min(1),
});

const responseJsonSchema = zodToJsonSchema(slideAnalysisSchema, {
  target: "openApi3",
  $refStrategy: "none",
});

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(apiKey: string) {
  geminiClient ??= new GoogleGenAI({ apiKey });
  return geminiClient;
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function base64DecodedByteLength(value: string) {
  const padding = value.endsWith("==") ? 2 : value.endsWith("=") ? 1 : 0;
  return Math.floor((value.length * 3) / 4) - padding;
}

function parsePngDataUrl(imageBase64: string) {
  if (!PNG_DATA_URL_PREFIX.test(imageBase64)) {
    return null;
  }

  const base64Data = imageBase64.replace(PNG_DATA_URL_PREFIX, "");
  if (base64Data.length % 4 !== 0) {
    return null;
  }

  return base64Data;
}

function mapGeminiError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const statusMatch = message.match(/\b(400|403|404|429|500|503)\b/);
  const upstreamStatus = statusMatch ? Number(statusMatch[1]) : undefined;

  if (upstreamStatus === 400) {
    return { status: 400, message: "Gemini rejected the analysis request" };
  }
  if (upstreamStatus === 403) {
    return { status: 403, message: "Gemini API key is invalid or unauthorized" };
  }
  if (upstreamStatus === 404) {
    return { status: 404, message: "Gemini model was not found" };
  }
  if (upstreamStatus === 429) {
    return { status: 429, message: "Gemini rate limit exceeded" };
  }
  if (upstreamStatus === 503) {
    return { status: 503, message: "Gemini service is temporarily unavailable" };
  }
  if (upstreamStatus === 500) {
    return { status: 502, message: "Gemini analysis failed" };
  }

  return { status: 500, message: "Analysis failed" };
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return jsonError("Gemini API key is not configured", 500);
  }

  const body = requestSchema.safeParse(await req.json());
  if (!body.success) {
    return jsonError("Request must include imageBase64", 400);
  }

  const base64Data = parsePngDataUrl(body.data.imageBase64);
  if (!base64Data) {
    return jsonError("imageBase64 must be a PNG data URL", 400);
  }

  if (base64DecodedByteLength(base64Data) > MAX_IMAGE_BYTES) {
    return jsonError("Image payload is too large", 413);
  }

  let response;
  try {
    response = await getGeminiClient(apiKey).models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          inlineData: {
            mimeType: "image/png",
            data: base64Data,
          },
        },
        {
          text: [
            "Analyze this presentation slide as a presentation-design reviewer.",
            "Return heuristic visual communication scores, not medical, neuroscience, or fMRI claims.",
            "Score attention by how strongly the slide creates a clear focal point and visual pull.",
            "Score comprehension by how easily a viewer can understand the message and hierarchy.",
            "Set cognitiveLoad based on visual density, competing elements, and effort required to parse the slide.",
            "Return only JSON that matches the schema.",
          ].join(" "),
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseJsonSchema,
        temperature: 0.2,
      },
    });
  } catch (error) {
    console.error("Analysis error:", error);
    const mapped = mapGeminiError(error);
    return jsonError(mapped.message, mapped.status);
  }

  if (!response.text) {
    return jsonError("Invalid model response", 502);
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(response.text);
  } catch {
    return jsonError("Invalid model response", 502);
  }

  const result = slideAnalysisSchema.safeParse(parsedJson);
  if (!result.success) {
    return jsonError("Invalid model response", 502);
  }

  return NextResponse.json(result.data);
}
