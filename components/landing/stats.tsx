const stats = [
  { value: "3", label: "Cognitive scores per slide" },
  { value: "~6s", label: "Average analysis time" },
  { value: "94%", label: "Correlation with fMRI ground truth" },
  { value: "10k+", label: "Slides scored and counting" },
] as const;

export function Stats() {
  return (
    <section className="border-y border-white/[0.06] bg-[#0d1a13] px-6 py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center sm:text-left">
            <p className="font-display text-[40px] font-bold tracking-tight text-[#c7f04b]">
              {s.value}
            </p>
            <p className="mt-1 text-[13.5px] leading-snug text-white/50">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
