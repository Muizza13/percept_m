import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { writeFile, readdir, mkdir, rename, copyFile } from "fs/promises";
import { join } from "path";
import { promisify } from "util";
import { tmpdir } from "os";
import {
  canonicalSlideFileName,
  createDeckId,
  ensureDeckDirectory,
  slideIndexFromFileName,
} from "@/lib/deck-cache";

const execAsync = promisify(exec);

export const maxDuration = 60;
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const deckId = createDeckId();
    const workDir = join(tmpdir(), `percept-${deckId}`);
    await mkdir(workDir, { recursive: true });

    const isPDF = file.name.endsWith(".pdf");
    const isPPT = file.name.endsWith(".ppt") || file.name.endsWith(".pptx");
    const inputPath = join(workDir, file.name);
    const pdfPath = join(workDir, "input.pdf");

    await writeFile(inputPath, buffer);

    if (isPPT) {
      await execAsync(
        `soffice --headless --convert-to pdf "${inputPath}" --outdir "${workDir}"`,
      );
      const converted = file.name.replace(/\.pptx?$/, ".pdf");
      await rename(join(workDir, converted), pdfPath);
    }

    if (isPDF) {
      await copyFile(inputPath, pdfPath);
    }

    await execAsync(
      `pdftoppm -png -r 200 "${pdfPath}" "${join(workDir, "slide")}"`,
    );

    const images = (await readdir(workDir))
      .map((fileName) => ({ fileName, index: slideIndexFromFileName(fileName) }))
      .filter(
        (slide): slide is { fileName: string; index: number } =>
          slide.index !== null,
      )
      .sort((a, b) => a.index - b.index);

    if (images.length === 0) {
      return NextResponse.json(
        { error: "No slides could be extracted" },
        { status: 500 },
      );
    }

    const deckDir = await ensureDeckDirectory(deckId);
    await Promise.all(
      images.map((slide) =>
        rename(
          join(workDir, slide.fileName),
          join(deckDir, canonicalSlideFileName(slide.index)),
        ),
      ),
    );

    return NextResponse.json({
      deckId,
      slides: images.map((slide) => ({
        index: slide.index,
        imageUrl: `/api/slides/${deckId}/${slide.index}`,
      })),
    });
  } catch (error) {
    console.error("Conversion error:", error);
    return NextResponse.json({ error: "Conversion failed" }, { status: 500 });
  }
}
