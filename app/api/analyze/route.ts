import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json();

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Buffer.from(base64Data, "base64");

    const response = await fetch(
      "https://api-inference.huggingface.co/models/google/siglip-base-patch16-224",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/octet-stream",
        },
        body: imageBuffer,
      },
    );

    const result = await response.json();

    const topScore = Array.isArray(result) ? (result[0]?.score ?? 0.5) : 0.5;

    const attention = Math.min(Math.round(topScore * 100), 100);
    const comprehension = Math.min(
      Math.round((topScore * 0.85 + 0.1) * 100),
      100,
    );
    const cognitiveLoad =
      attention > 75 ? "Low" : attention > 50 ? "Medium" : "High";

    return NextResponse.json({ attention, comprehension, cognitiveLoad });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
