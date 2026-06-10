"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";

function generateInsight(r: any): string {
  if (!r || r.attention === undefined) return "";

  const attention = r.attention;
  const comprehension = r.comprehension;
  const load = r.cognitiveLoad;

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
  } else {
    if (attention < 40 && comprehension < 40) {
      loadNote = `Cognitive load is high across both dimensions — attention at ${attention} and comprehension at ${comprehension}. This slide is both hard to engage with and hard to understand, making it the highest priority for redesign.`;
    } else {
      loadNote = `High cognitive load is driven primarily by ${attention < comprehension ? `low attention (${attention})` : `low comprehension (${comprehension})`}. Addressing this single dimension would likely bring the overall cognitive demand down significantly.`;
    }
  }

  return `${attentionNote} ${comprehensionNote} ${loadNote}`;
}

function generateRecommendations(r: any): string[] {
  if (!r || r.attention === undefined) return [];

  const attention = r.attention;
  const comprehension = r.comprehension;
  const load = r.cognitiveLoad;
  const recs: string[] = [];

  // attention recommendations
  if (attention < 50) {
    recs.push(
      "Increase contrast between the background and text or key visuals. A stronger contrast ratio gives the brain a clear entry point and immediately improves attention.",
    );
    recs.push(
      "Add a single dominant visual element — a chart, icon, or bold headline — that acts as an anchor. Slides without a clear focal point cause the eye to scan aimlessly.",
    );
  } else if (attention < 70) {
    recs.push(
      "Try increasing whitespace around key elements. Crowded layouts distribute attention evenly, which ironically reduces engagement with the most important content.",
    );
    recs.push(
      "Consider using a accent color or bold typography for the slide's single most important point. Visual hierarchy signals to the brain where to look first.",
    );
  }

  // comprehension recommendations
  if (comprehension < 50) {
    recs.push(
      "Break this slide into two. When more than one major idea competes for space, comprehension suffers. Each slide should communicate exactly one core message.",
    );
    recs.push(
      "Replace long text blocks with bullet points of no more than 6-8 words each. The brain processes chunked information significantly faster than dense paragraphs.",
    );
    recs.push(
      "Use a diagram, flowchart, or visual metaphor instead of text wherever possible. Dual coding — pairing visuals with words — produces up to 6x better retention.",
    );
  } else if (comprehension < 70) {
    recs.push(
      "Reduce the number of distinct visual elements on the slide. Each additional item adds cognitive overhead. Aim for 3-5 elements maximum per slide.",
    );
    recs.push(
      "Ensure the reading order is obvious — top to bottom, left to right. If a viewer has to figure out where to start, comprehension drops before the content is even processed.",
    );
  }

  // cognitive load recommendations
  if (load === "High") {
    recs.push(
      "This slide needs the most urgent redesign in the deck. Start by cutting content by at least 40%, then reintroduce only what is absolutely essential for the viewer to understand the core point.",
    );
    recs.push(
      "Use a consistent grid layout. Misaligned or irregularly placed elements force the brain to spend processing power on spatial orientation rather than content.",
    );
  } else if (load === "Medium") {
    recs.push(
      "Consider using progressive disclosure — reveal information step by step during the presentation rather than showing everything at once. This keeps cognitive load manageable.",
    );
  }

  // gap-based recommendation
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

  // if already good
  if (attention >= 70 && comprehension >= 70 && load === "Low") {
    recs.push(
      "This slide is well-optimised. No major changes needed. If anything, use it as a template for redesigning lower-scoring slides in this deck.",
    );
  }

  return recs;
}

function AnalysisResults() {
  const [results, setResults] = useState<any[]>([]);
  const [slides, setSlides] = useState<string[]>([]);

  useEffect(() => {
    const stored = sessionStorage.getItem("perceptResults");
    const storedSlides = sessionStorage.getItem("perceptSlides");
    if (stored) setResults(JSON.parse(stored));
    if (storedSlides) setSlides(JSON.parse(storedSlides));
  }, []);

  return (
    <main className="min-h-screen bg-[#020817] text-white">
      <section className="max-w-5xl mx-auto px-8 pt-32 pb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-xs text-violet-300">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
            Analysis results
          </div>
          <Link
            href="/upload"
            className="text-xs text-white/40 hover:text-white/70 transition border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl"
          >
            Upload new file
          </Link>
        </div>
        <h1 className="text-4xl font-semibold mb-3">Brain analysis</h1>
        <p className="text-white/40 text-base">
          {results.length} slide{results.length !== 1 ? "s" : ""} analyzed.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-8 pb-10">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
            <p className="text-xs text-white/40 mb-2">Avg attention</p>
            <p className="text-4xl font-medium text-blue-400">
              {results.length > 0
                ? Math.round(
                    results.reduce(
                      (a: number, r: any) => a + (r.attention ?? 0),
                      0,
                    ) / results.length,
                  )
                : 0}
              <span className="text-lg text-white/25">/100</span>
            </p>
            <p className="text-xs text-white/25 mt-1">
              Across {results.length} slides
            </p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
            <p className="text-xs text-white/40 mb-2">Avg comprehension</p>
            <p className="text-4xl font-medium text-violet-400">
              {results.length > 0
                ? Math.round(
                    results.reduce(
                      (a: number, r: any) => a + (r.comprehension ?? 0),
                      0,
                    ) / results.length,
                  )
                : 0}
              <span className="text-lg text-white/25">/100</span>
            </p>
            <p className="text-xs text-white/25 mt-1">
              Across {results.length} slides
            </p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
            <p className="text-xs text-white/40 mb-2">Slides analyzed</p>
            <p className="text-4xl font-medium text-teal-400">
              {results.length}
            </p>
            <p className="text-xs text-white/25 mt-1">From your upload</p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-8 pb-32 space-y-6">
        <p className="text-xs text-white/30 uppercase tracking-widest">
          Per slide breakdown
        </p>
        {results.map((r: any, i: number) => (
          <div
            key={i}
            className="border border-white/[0.07] bg-white/[0.02] rounded-2xl overflow-hidden"
          >
            <div className="grid grid-cols-2">
              {/* slide image */}
              <div className="bg-black/20 border-r border-white/[0.07] flex items-center justify-center min-h-[240px]">
                {slides[i] ? (
                  <img
                    src={slides[i]}
                    alt={`Slide ${i + 1}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full aspect-video flex items-center justify-center">
                    <p className="text-xs text-white/20">No preview</p>
                  </div>
                )}
              </div>

              {/* scores */}
              <div className="p-7 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white/70">
                    Slide {i + 1}
                  </p>
                  <span
                    className={`text-xs px-3 py-1 rounded-full border ${
                      r.cognitiveLoad === "Low"
                        ? "text-teal-400 bg-teal-500/10 border-teal-500/20"
                        : r.cognitiveLoad === "Medium"
                          ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                          : "text-red-400 bg-red-500/10 border-red-500/20"
                    }`}
                  >
                    {r.cognitiveLoad} cognitive load
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">
                    <p className="text-xs text-white/40 mb-1">Attention</p>
                    <p className="text-2xl font-medium text-blue-400">
                      {r.attention}
                      <span className="text-sm text-white/25">/100</span>
                    </p>
                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-700"
                        style={{ width: `${r.attention}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-3">
                    <p className="text-xs text-white/40 mb-1">Comprehension</p>
                    <p className="text-2xl font-medium text-violet-400">
                      {r.comprehension}
                      <span className="text-sm text-white/25">/100</span>
                    </p>
                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-500 rounded-full transition-all duration-700"
                        style={{ width: `${r.comprehension}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* insight */}
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3">
                  <p className="text-xs text-white/30 uppercase tracking-widest mb-2">
                    Why these scores
                  </p>
                  <p className="text-xs text-white/50 leading-relaxed">
                    {generateInsight(r)}
                  </p>
                </div>
              </div>
            </div>

            {/* recommendations — full width below */}
            <div className="border-t border-white/[0.07] px-7 py-5">
              <p className="text-xs text-white/30 uppercase tracking-widest mb-4">
                Recommendations
              </p>
              <div className="grid grid-cols-1 gap-3">
                {generateRecommendations(r).map((rec, j) => (
                  <div
                    key={j}
                    className="flex gap-3 items-start bg-white/[0.02] border border-white/[0.05] rounded-xl px-4 py-3"
                  >
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xs font-medium">
                      {j + 1}
                    </span>
                    <p className="text-xs text-white/50 leading-relaxed">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020817]" />}>
      <AnalysisResults />
    </Suspense>
  );
}
