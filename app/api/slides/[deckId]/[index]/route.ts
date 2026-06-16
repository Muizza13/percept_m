import { NextRequest, NextResponse } from "next/server";
import { readSlide, slideExists } from "@/lib/deck-cache";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    deckId: string;
    index: string;
  }>;
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(_req: NextRequest, context: RouteContext) {
  const { deckId, index } = await context.params;
  const slideIndex = Number(index);

  if (!Number.isInteger(slideIndex) || slideIndex < 0) {
    return jsonError("Invalid slide index", 400);
  }

  try {
    if (!(await slideExists(deckId, slideIndex))) {
      return jsonError("Slide not found", 404);
    }

    const image = await readSlide(deckId, slideIndex);
    return new NextResponse(image, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return jsonError("Slide not found", 404);
  }
}
