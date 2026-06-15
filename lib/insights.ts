import { z } from "zod/v3";

export const cognitiveLoadSchema = z.enum(["Low", "Medium", "High"]);
export type CognitiveLoad = z.infer<typeof cognitiveLoadSchema>;

export const slideResultSchema = z.object({
  attention: z.number(),
  comprehension: z.number(),
  cognitiveLoad: cognitiveLoadSchema,
  insight: z.string().optional(),
  recommendations: z.array(z.string()).optional(),
});

export type SlideResult = z.infer<typeof slideResultSchema>;

export const slideAnalysisSchema = z.object({
  attention: z.number().int().min(0).max(100),
  comprehension: z.number().int().min(0).max(100),
  cognitiveLoad: cognitiveLoadSchema,
  insight: z.string().min(20),
  recommendations: z.array(z.string().min(10)).min(2).max(5),
});

export function parseSlideResult(value: unknown): SlideResult | null {
  const parsed = slideResultSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export function resolveSlideContent(r: SlideResult) {
  return {
    insight: r.insight?.trim() ? r.insight : generateInsight(r),
    recommendations:
      r.recommendations && r.recommendations.length > 0
        ? r.recommendations
        : generateRecommendations(r),
  };
}

export function generateInsight(r: SlideResult): string {
  const { attention, comprehension, cognitiveLoad: load } = r;

  let attentionNote = "";
  if (attention >= 80) {
    attentionNote = `Attention is strong at ${attention}/100. The contrast levels and layout complexity are well-balanced, making it easy for the eye to find a focal point quickly.`;
  } else if (attention >= 65) {
    attentionNote = `Attention scores ${attention}/100, holding viewer focus reasonably well. Minor improvements to contrast or whitespace could push engagement higher.`;
  } else if (attention >= 45) {
    attentionNote = `A moderate attention score of ${attention}/100 suggests the visual structure lacks a clear focal point, which may cause the viewer's eye to wander before landing on the key message.`;
  } else if (attention >= 30) {
    attentionNote = `Attention is low at ${attention}/100. The layout may be too uniform or too dense, reducing the visual pull that guides a viewer's gaze.`;
  } else {
    attentionNote = `At just ${attention}/100, visual engagement is very low. Extremely high density or low contrast are likely causing the brain to disengage before processing the content.`;
  }

  let comprehensionNote = "";
  if (comprehension >= 80) {
    comprehensionNote = `Comprehension is high at ${comprehension}/100, meaning the information is presented cleanly and the cognitive path through the slide is clear.`;
  } else if (comprehension >= 65) {
    comprehensionNote = `A comprehension score of ${comprehension}/100 means the slide is largely readable, though some elements may add unnecessary processing overhead.`;
  } else if (comprehension >= 45) {
    comprehensionNote = `At ${comprehension}/100 for comprehension, viewers may need extra effort to extract the main idea. Reducing text blocks or breaking content into smaller visual units would help.`;
  } else if (comprehension >= 30) {
    comprehensionNote = `Comprehension drops to ${comprehension}/100, likely due to high information density competing for the same visual space. A cleaner hierarchy or splitting into two slides is recommended.`;
  } else {
    comprehensionNote = `With comprehension at only ${comprehension}/100, this is a cognitively demanding slide. The brain has to work too hard to find the structure before it can absorb the content.`;
  }

  let loadNote = "";
  const gap = Math.abs(attention - comprehension);
  if (load === "Low") {
    if (gap <= 10) {
      loadNote = `Cognitive load is low and both scores are closely aligned (${attention} vs ${comprehension}), suggesting a well-balanced slide that is both engaging and easy to understand.`;
    } else {
      loadNote = `Overall cognitive load is low, though the gap between attention (${attention}) and comprehension (${comprehension}) suggests the slide is visually engaging but slightly harder to parse than it looks.`;
    }
  } else if (load === "Medium") {
    if (attention > comprehension) {
      loadNote = `Cognitive load is medium. Attention (${attention}) outpaces comprehension (${comprehension}), meaning the slide catches the eye but the content arrangement makes it harder to process quickly.`;
    } else {
      loadNote = `Cognitive load is medium. Comprehension (${comprehension}) leads attention (${attention}), suggesting the content is clear once engaged but the slide does not draw the viewer in strongly.`;
    }
  } else if (attention < 40 && comprehension < 40) {
    loadNote = `Cognitive load is high across both dimensions — attention at ${attention} and comprehension at ${comprehension}. This slide is both hard to engage with and hard to understand, making it the highest priority for redesign.`;
  } else {
    loadNote = `High cognitive load is driven primarily by ${attention < comprehension ? `low attention (${attention})` : `low comprehension (${comprehension})`}. Addressing this single dimension would likely bring the overall cognitive demand down significantly.`;
  }

  return `${attentionNote} ${comprehensionNote} ${loadNote}`;
}

export function generateRecommendations(r: SlideResult): string[] {
  const { attention, comprehension, cognitiveLoad: load } = r;
  const recs: string[] = [];

  if (attention < 50) {
    recs.push(
      "Increase contrast between the background and text or key visuals. A stronger contrast ratio gives the brain a clear entry point and immediately improves attention.",
      "Add a single dominant visual element — a chart, icon, or bold headline — that acts as an anchor. Slides without a clear focal point cause the eye to scan aimlessly.",
    );
  } else if (attention < 70) {
    recs.push(
      "Try increasing whitespace around key elements. Crowded layouts distribute attention evenly, which ironically reduces engagement with the most important content.",
      "Consider using a accent color or bold typography for the slide's single most important point. Visual hierarchy signals to the brain where to look first.",
    );
  }

  if (comprehension < 50) {
    recs.push(
      "Break this slide into two. When more than one major idea competes for space, comprehension suffers. Each slide should communicate exactly one core message.",
      "Replace long text blocks with bullet points of no more than 6-8 words each. The brain processes chunked information significantly faster than dense paragraphs.",
      "Use a diagram, flowchart, or visual metaphor instead of text wherever possible. Dual coding — pairing visuals with words — produces up to 6x better retention.",
    );
  } else if (comprehension < 70) {
    recs.push(
      "Reduce the number of distinct visual elements on the slide. Each additional item adds cognitive overhead. Aim for 3-5 elements maximum per slide.",
      "Ensure the reading order is obvious — top to bottom, left to right. If a viewer has to figure out where to start, comprehension drops before the content is even processed.",
    );
  }

  if (load === "High") {
    recs.push(
      "This slide needs the most urgent redesign in the deck. Start by cutting content by at least 40%, then reintroduce only what is absolutely essential for the viewer to understand the core point.",
      "Use a consistent grid layout. Misaligned or irregularly placed elements force the brain to spend processing power on spatial orientation rather than content.",
    );
  } else if (load === "Medium") {
    recs.push(
      "Consider using progressive disclosure — reveal information step by step during the presentation rather than showing everything at once. This keeps cognitive load manageable.",
    );
  }

  const gap = attention - comprehension;
  if (gap > 20) {
    recs.push(
      "The slide is visually engaging but hard to understand. Focus the next revision on clarity — simplify the layout while keeping the visual elements that are already drawing attention.",
    );
  } else if (gap < -20) {
    recs.push(
      "The content is clear but the slide fails to grab attention. Add a stronger visual hook at the top — a striking statistic, a bold question, or a high-contrast image — to draw viewers in before they read.",
    );
  }

  if (attention >= 70 && comprehension >= 70 && load === "Low") {
    recs.push(
      "This slide is well-optimised. No major changes needed. If anything, use it as a template for redesigning lower-scoring slides in this deck.",
    );
  }

  return recs;
}
