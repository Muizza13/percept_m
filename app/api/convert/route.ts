import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { writeFile, readdir, readFile, mkdir } from "fs/promises";
import { join } from "path";
import { promisify } from "util";
import { tmpdir } from "os";

const execAsync = promisify(exec);

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const workDir = join(tmpdir(), `percept-${Date.now()}`);
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
      await execAsync(`mv "${join(workDir, converted)}" "${pdfPath}"`);
    }

    if (isPDF) {
      await execAsync(`cp "${inputPath}" "${pdfPath}"`);
    }

    await execAsync(
      `pdftoppm -png -r 200 "${pdfPath}" "${join(workDir, "slide")}"`,
    );

    const files = await readdir(workDir);
    const images = files
      .filter((f) => f.startsWith("slide") && f.endsWith(".png"))
      .sort();

    if (images.length === 0) {
      return NextResponse.json(
        { error: "No slides could be extracted" },
        { status: 500 },
      );
    }

    const base64Images = await Promise.all(
      images.map(async (img) => {
        const data = await readFile(join(workDir, img));
        return `data:image/png;base64,${data.toString("base64")}`;
      }),
    );

    return NextResponse.json({ slides: base64Images });
  } catch (error) {
    console.error("Conversion error:", error);
    return NextResponse.json({ error: "Conversion failed" }, { status: 500 });
  }
}
