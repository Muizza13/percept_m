import "server-only";

import { mkdir, readFile, readdir, stat } from "fs/promises";
import { join, resolve } from "path";
import { randomUUID } from "crypto";

export const DECK_ID_PATTERN = /^[a-f0-9-]{36}$/;
export const SLIDE_FILE_PATTERN = /^slide-(\d+)\.png$/;

const cacheRoot = resolve(process.cwd(), ".percept-cache");

export function createDeckId() {
  return randomUUID();
}

export function deckDirectory(deckId: string) {
  assertValidDeckId(deckId);
  return join(cacheRoot, deckId);
}

export function slidePath(deckId: string, slideIndex: number) {
  assertValidDeckId(deckId);
  assertValidSlideIndex(slideIndex);
  return join(deckDirectory(deckId), `slide-${slideIndex + 1}.png`);
}

export function canonicalSlideFileName(slideIndex: number) {
  assertValidSlideIndex(slideIndex);
  return `slide-${slideIndex + 1}.png`;
}

export async function ensureDeckDirectory(deckId: string) {
  const dir = deckDirectory(deckId);
  await mkdir(dir, { recursive: true });
  return dir;
}

export async function readSlide(deckId: string, slideIndex: number) {
  return readFile(await resolveSlidePath(deckId, slideIndex));
}

export async function slideExists(deckId: string, slideIndex: number) {
  try {
    const file = await stat(await resolveSlidePath(deckId, slideIndex));
    return file.isFile();
  } catch {
    return false;
  }
}

async function resolveSlidePath(deckId: string, slideIndex: number) {
  const canonicalPath = slidePath(deckId, slideIndex);
  try {
    const file = await stat(canonicalPath);
    if (file.isFile()) {
      return canonicalPath;
    }
  } catch {
    // Fall back to Poppler's padded filenames from existing cache entries.
  }

  const dir = deckDirectory(deckId);
  const files = await readdir(dir);
  const matchingFile = files.find(
    (fileName) => slideIndexFromFileName(fileName) === slideIndex,
  );

  if (!matchingFile) {
    throw new Error("Slide not found");
  }

  return join(dir, matchingFile);
}

export function assertValidDeckId(deckId: string) {
  if (!DECK_ID_PATTERN.test(deckId)) {
    throw new Error("Invalid deck id");
  }
}

export function assertValidSlideIndex(slideIndex: number) {
  if (!Number.isInteger(slideIndex) || slideIndex < 0) {
    throw new Error("Invalid slide index");
  }
}

export function slideIndexFromFileName(fileName: string) {
  const match = fileName.match(SLIDE_FILE_PATTERN);
  return match ? Number(match[1]) - 1 : null;
}
