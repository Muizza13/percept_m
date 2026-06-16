import { z } from "zod/v3";

export const slideReferenceSchema = z.object({
  index: z.number().int().min(0),
  imageUrl: z.string().min(1),
});

export type SlideReference = z.infer<typeof slideReferenceSchema>;

export function parseSlideReferences(value: unknown): SlideReference[] {
  const parsed = z.array(slideReferenceSchema).safeParse(value);
  return parsed.success ? parsed.data : [];
}
