import Link from "next/link";

export default function Home() {
  return (
    <main className="font-body min-h-screen overflow-hidden bg-[#0b1711] text-white">
      <Hero />
      <TrustedBy />
      <Features />
      <Science />
      <HowItWorks />
      <Stats />
      <Team />
      <CTA />
      <Footer />
    </main>
  );
}

/* ===========================================================================
   HERO
=========================================================================== */
function Hero() {
  return (
    <section
      id="product"
      className="relative isolate overflow-hidden bg-gradient-to-b from-[#14271c] via-[#13241a] to-[#0b1711] px-6 pb-28 pt-36 sm:pt-40"
    >
      <div className="absolute inset-0 -z-10 bg-blueprint" />
      <div className="glow-lime pointer-events-none absolute left-1/2 top-24 -z-10 h-[520px] w-[820px] -translate-x-1/2" />

      <div className="mx-auto max-w-4xl text-center">
        <div className="p-rise mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1.5 pl-2 pr-3 backdrop-blur">
          <span className="rounded-full bg-[#c7f04b] px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[#10231a]">
            Live
          </span>
          <span className="text-[13px] text-white/70">
            Neural analysis engine, trained on real fMRI data
          </span>
        </div>

        <h1 className="font-display p-rise text-[44px] font-bold leading-[1.04] tracking-tight text-white sm:text-[64px]">
          See how your slides
          <br />
          <span className="text-[#c7f04b]">land in the brain</span>
        </h1>

        <p
          className="p-rise mx-auto mt-6 max-w-xl text-[16px] leading-relaxed text-white/55"
          style={{ animationDelay: "80ms" }}
        >
          Percept scores every slide on attention, comprehension, and cognitive
          load using brain-trained models — then tells you, in plain language,
          exactly what to fix before you present.
        </p>

        <div
          className="p-rise mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: "140ms" }}
        >
          <Link
            href="/upload"
            className="group flex items-center gap-2 rounded-full bg-[#c7f04b] px-6 py-3.5 text-[14px] font-semibold text-[#10231a] transition hover:bg-[#d4f56b]"
          >
            Analyze your deck — free
            <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="#how"
            className="rounded-full border border-white/15 px-6 py-3.5 text-[14px] text-white/80 transition hover:border-white/35 hover:text-white"
          >
            See how it works
          </Link>
        </div>
      </div>

      <ProductCard />
    </section>
  );
}

function ProductCard() {
  const scores = [
    { label: "Attention", icon: <EyeIcon className="h-4 w-4" /> },
    { label: "Comprehension", icon: <BulbIcon className="h-4 w-4" /> },
    { label: "Cognitive load", icon: <GaugeIcon className="h-4 w-4" /> },
    { label: "Heatmap", icon: <GridIcon className="h-4 w-4" /> },
  ];

  return (
    <div
      className="p-rise glow-emerald p-float relative mx-auto mt-16 max-w-3xl rounded-3xl border border-white/10 bg-[#0e1c14]/80 p-3 backdrop-blur-xl"
      style={{ animationDelay: "220ms" }}
    >
      <div className="rounded-[20px] border border-white/[0.06] bg-[#10211880] p-6 sm:p-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-pulse-dot h-2 w-2 rounded-full bg-[#c7f04b]" />
            <p className="text-[14px] font-medium text-white/85">
              Analyze a new deck
            </p>
          </div>
          <span className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-white/45">
            TRIBE v2 · ready
          </span>
        </div>

        {/* fake input row */}
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-3 py-2.5">
          <button
            type="button"
            aria-label="Upload"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 text-white/60"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
          <div className="flex -space-x-2">
            {["#c7f04b", "#7fd1a2", "#4fb8c9"].map((c) => (
              <span
                key={c}
                className="h-7 w-7 rounded-full border-2 border-[#102118]"
                style={{ background: c }}
              />
            ))}
          </div>
          <p className="flex-1 truncate text-[13.5px] text-white/40">
            Drop a .pptx, .pdf or paste a slide…
          </p>
          <button
            type="button"
            aria-label="Run analysis"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c7f04b] text-[#10231a]"
          >
            <ArrowIcon className="h-4 w-4" />
          </button>
        </div>

        {/* chips */}
        <div className="mt-5 flex flex-wrap gap-2">
          {scores.map((s) => (
            <span
              key={s.label}
              className="flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[12.5px] text-white/70"
            >
              <span className="text-[#c7f04b]">{s.icon}</span>
              {s.label}
            </span>
          ))}
          <span className="flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[12.5px] text-white/40">
            <DotsIcon className="h-4 w-4" />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ===========================================================================
   TRUSTED BY  (curved light panel)
=========================================================================== */
function TrustedBy() {
  const logos = [
    "Lumen Labs",
    "Vertex EDU",
    "Northwind",
    "Cortexa",
    "Helio",
    "Atlas Academy",
  ];
  const row = [...logos, ...logos];

  return (
    <section className="relative -mt-10 rounded-t-[40px] bg-[#f3f1e7] pt-14 text-[#10231a]">
      <p className="text-center text-[12px] font-semibold uppercase tracking-[0.18em] text-[#10231a]/45">
        Trusted by teams who present for a living
      </p>
      <div className="relative mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="p-marquee flex w-max items-center gap-14 pr-14">
          {row.map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="flex shrink-0 items-center gap-2.5 text-[#10231a]/55"
            >
              <BrandMark seed={i} />
              <span className="font-display whitespace-nowrap text-[17px] font-semibold tracking-tight">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===========================================================================
   FEATURES (light)
=========================================================================== */
function Features() {
  return (
    <section id="features" className="bg-[#f3f1e7] px-6 pb-28 pt-20 text-[#10231a]">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#3c6b4f]">
            Why Percept
          </span>
          <h2 className="font-display mt-4 text-[34px] font-bold leading-tight tracking-tight sm:text-[42px]">
            Most slide tools check spelling.
            <br />
            We check whether you were understood.
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed text-[#10231a]/60">
            Every deck runs through a neural encoding model trained on fMRI
            recordings of the human brain. The result is measurable, not a hunch.
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <FeatureCard
            wide
            icon={<EyeIcon className="h-5 w-5" />}
            title="Attention heatmaps"
            desc="A Grad-CAM overlay shows exactly where the brain looks first — and what it ignores. Catch buried headlines before your audience does."
          />
          <FeatureCard
            icon={<GaugeIcon className="h-5 w-5" />}
            title="Cognitive load score"
            desc="Know when a slide is doing too much, instantly."
          />
          <FeatureCard
            icon={<BulbIcon className="h-5 w-5" />}
            title="Plain-English advice"
            desc="LLM-written fixes, ranked by impact — no jargon."
          />
          <FeatureCard
            wide
            icon={<BoltIcon className="h-5 w-5" />}
            title="Results in seconds"
            desc="Upload a full deck and get per-slide cognitive scores back before your coffee cools. Built for the night before the big talk."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  wide,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`group rounded-3xl border border-[#10231a]/10 bg-white/60 p-7 transition hover:border-[#3c6b4f]/40 hover:bg-white ${
        wide ? "md:col-span-2" : ""
      }`}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10231a] text-[#c7f04b]">
        {icon}
      </span>
      <h3 className="font-display mt-5 text-[19px] font-semibold tracking-tight">
        {title}
      </h3>
      <p className="mt-2 text-[14.5px] leading-relaxed text-[#10231a]/60">
        {desc}
      </p>
    </div>
  );
}

/* ===========================================================================
   SCIENCE (dark) — custom brain/score visual
=========================================================================== */
function Science() {
  return (
    <section
      id="science"
      className="relative overflow-hidden bg-[#0b1711] px-6 py-28"
    >
      <div className="glow-lime pointer-events-none absolute right-0 top-10 -z-0 h-[420px] w-[520px]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
        <div>
          <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#c7f04b]">
            The science
          </span>
          <h2 className="font-display mt-4 text-[34px] font-bold leading-tight tracking-tight sm:text-[42px]">
            Not opinions.
            <br />
            A model of your audience&apos;s brain.
          </h2>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-white/55">
            Percept is powered by TRIBE v2, a neural encoder trained to predict
            blood-oxygen responses across the visual cortex. When it scores a
            slide, it is simulating how an actual brain would process it.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              "Trained on thousands of fMRI scan-image pairs",
              "Predicts attention, comprehension & load per slide",
              "Grad-CAM maps the precise focal points",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#c7f04b] text-[#10231a]">
                  <CheckIcon className="h-3 w-3" />
                </span>
                <span className="text-[15px] text-white/70">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <ScoreVisual />
      </div>
    </section>
  );
}

function ScoreVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-[#0e1c14]/70 p-6 backdrop-blur-xl">
      {/* slide preview with sweeping scan line */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#102118] p-5">
        <div className="p-sweep pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#c7f04b]/25 to-transparent" />
        <div className="h-2.5 w-2/3 rounded-full bg-white/15" />
        <div className="mt-3 h-2 w-1/2 rounded-full bg-white/10" />
        <div className="mt-6 flex gap-3">
          <div className="h-16 flex-1 rounded-lg bg-[#c7f04b]/15 ring-1 ring-[#c7f04b]/30" />
          <div className="h-16 flex-1 rounded-lg bg-white/[0.05]" />
        </div>
        <div className="mt-3 h-2 w-3/4 rounded-full bg-white/10" />
      </div>

      {/* score rows */}
      <div className="mt-5 space-y-4">
        <ScoreBar label="Attention" value={87} note="Above average" />
        <ScoreBar label="Comprehension" value={72} note="Needs work" />
        <ScoreBar label="Cognitive load" value={34} note="Optimal" />
      </div>
    </div>
  );
}

function ScoreBar({
  label,
  value,
  note,
}: {
  label: string;
  value: number;
  note: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="text-[13px] text-white/65">{label}</span>
        <span className="font-display text-[15px] font-semibold text-white">
          {value}
          <span className="text-[11px] text-white/35">/100</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className="h-full rounded-full bg-[#c7f04b]"
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="mt-1 text-[11px] text-white/35">{note}</p>
    </div>
  );
}

/* ===========================================================================
   HOW IT WORKS
=========================================================================== */
function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Upload your deck",
      desc: "Drop a .pptx, .ppt or .pdf. Percept converts every slide into a clean, analysis-ready image.",
      icon: <UploadIcon className="h-5 w-5" />,
    },
    {
      n: "02",
      title: "The model reads it",
      desc: "TRIBE v2 predicts the brain's response and Grad-CAM maps exactly where attention lands.",
      icon: <BrainIcon className="h-5 w-5" />,
    },
    {
      n: "03",
      title: "Get your fixes",
      desc: "Three cognitive scores per slide plus ranked, plain-English suggestions to improve them.",
      icon: <SparkIcon className="h-5 w-5" />,
    },
  ];

  return (
    <section id="how" className="bg-[#0b1711] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#c7f04b]">
            How it works
          </span>
          <h2 className="font-display mt-4 text-[34px] font-bold tracking-tight sm:text-[42px]">
            From slide to brain insight in three steps
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="relative rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7 transition hover:border-[#c7f04b]/30"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#c7f04b] text-[#10231a]">
                  {s.icon}
                </span>
                <span className="font-display text-[28px] font-bold text-white/10">
                  {s.n}
                </span>
              </div>
              <h3 className="font-display mt-6 text-[19px] font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-white/55">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===========================================================================
   STATS
=========================================================================== */
function Stats() {
  const stats = [
    { value: "3", label: "Cognitive scores per slide" },
    { value: "~6s", label: "Average analysis time" },
    { value: "94%", label: "Correlation with fMRI ground truth" },
    { value: "10k+", label: "Slides scored and counting" },
  ];
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

/* ===========================================================================
   TEAM — the builders + supervisor
=========================================================================== */
function Team() {
  const team = [
    { name: "Salik Yousuf Shigan", initials: "SY" },
    { name: "Muizza Muayqeeb Akram", initials: "MM" },
    { name: "Shakeeb Arslan Naqash", initials: "SA" },
  ];

  return (
    <section id="team" className="bg-[#0b1711] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#c7f04b]">
            The builders
          </span>
          <h2 className="font-display mt-4 text-[34px] font-bold tracking-tight sm:text-[42px]">
            Made by a team that had to present too
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/50">
            Percept began as a final-year project at IUST Kashmir, Department of
            Computer Science &amp; Engineering.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {team.map((m) => (
            <div
              key={m.name}
              className="group rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7 transition hover:border-[#c7f04b]/30 hover:bg-white/[0.04]"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#c7f04b]/25 bg-[#c7f04b]/10 text-[16px] font-semibold text-[#c7f04b]">
                {m.initials}
              </div>
              <p className="font-display mt-5 text-[17px] font-semibold tracking-tight text-white">
                {m.name}
              </p>
              <p className="mt-1 text-[13px] text-white/40">
                IUST CSE · Batch 2023–27
              </p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-5 flex max-w-md items-center gap-5 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] text-[16px] font-semibold text-white/80">
            SS
          </div>
          <div>
            <p className="font-display text-[17px] font-semibold tracking-tight text-white">
              Dr. Sahil Sholla
            </p>
            <p className="mt-0.5 text-[13px] text-[#c7f04b]">Supervisor</p>
            <p className="text-[13px] text-white/40">
              Department of CSE, IUST Kashmir
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===========================================================================
   CTA
=========================================================================== */
function CTA() {
  return (
    <section id="pricing" className="bg-[#0b1711] px-6 py-24">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[36px] bg-[#c7f04b] px-8 py-16 text-center text-[#10231a]">
        <div className="pointer-events-none absolute inset-0 bg-blueprint opacity-[0.12]" />
        <div className="relative">
          <h2 className="font-display mx-auto max-w-2xl text-[34px] font-bold leading-tight tracking-tight sm:text-[46px]">
            Stop guessing whether your slides work.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[16px] text-[#10231a]/70">
            Upload a deck and see your first brain-scored slide in under ten
            seconds. No card, no setup.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/upload"
              className="group flex items-center gap-2 rounded-full bg-[#10231a] px-7 py-3.5 text-[14px] font-semibold text-white transition hover:bg-[#16321f]"
            >
              Analyze your deck
              <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-[#10231a]/25 px-7 py-3.5 text-[14px] font-semibold text-[#10231a] transition hover:bg-[#10231a]/[0.06]"
            >
              Meet the team
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===========================================================================
   FOOTER
=========================================================================== */
function Footer() {
  const cols = [
    { h: "Product", items: ["Overview", "The science", "How it works", "Pricing"] },
    { h: "Company", items: ["About", "Team", "Research", "Contact"] },
    { h: "Resources", items: ["Docs", "Changelog", "Privacy", "Terms"] },
  ];
  return (
    <footer className="border-t border-white/[0.06] bg-[#0b1711] px-6 pb-10 pt-16">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c7f04b]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 12c3-7 15-7 18 0-3 7-15 7-18 0Z"
                  stroke="#10231a"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="3.1" fill="#10231a" />
              </svg>
            </span>
            <span className="font-display text-[17px] font-semibold tracking-tight">
              Percept
            </span>
          </div>
          <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-white/45">
            Brain-trained slide analysis. Built at IUST Kashmir, Department of
            Computer Science & Engineering.
          </p>
        </div>

        {cols.map((c) => (
          <div key={c.h}>
            <p className="text-[13px] font-semibold text-white/80">{c.h}</p>
            <ul className="mt-4 space-y-2.5">
              {c.items.map((it) => (
                <li key={it}>
                  <Link
                    href="#"
                    className="text-[13.5px] text-white/45 transition hover:text-white/80"
                  >
                    {it}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 sm:flex-row">
        <p className="text-[13px] text-white/35">
          © {new Date().getFullYear()} Percept. All rights reserved.
        </p>
        <div className="flex items-center gap-2 text-[13px] text-white/35">
          <span className="p-pulse-dot h-1.5 w-1.5 rounded-full bg-[#c7f04b]" />
          All systems operational
        </div>
      </div>
    </footer>
  );
}

/* ===========================================================================
   ICONS (custom inline SVGs)
=========================================================================== */
type IconProps = { className?: string };

function ArrowIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function PlusIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function DotsIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="6" cy="12" r="1.6" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <circle cx="18" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}
function EyeIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function BulbIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.45.9 1.05.9 1.7V16h5.4v-.5c0-.65.3-1.25.9-1.7A6 6 0 0 0 12 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function GaugeIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M4 18a8 8 0 1 1 16 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 18l4-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="18" r="1.6" fill="currentColor" />
    </svg>
  );
}
function GridIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M3.5 9.5h17M3.5 15h17M9.5 3.5v17M15 3.5v17" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
function BoltIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function CheckIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12.5 10 17l9-10"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function UploadIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 16V4m0 0L7 9m5-5 5 5M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function BrainIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 5.5a3 3 0 0 0-5.7-1.3A2.6 2.6 0 0 0 4 9a2.6 2.6 0 0 0 .8 4.6A2.8 2.8 0 0 0 8 18a3 3 0 0 0 4 .6m0-13.1a3 3 0 0 1 5.7-1.3A2.6 2.6 0 0 1 20 9a2.6 2.6 0 0 1-.8 4.6A2.8 2.8 0 0 1 16 18a3 3 0 0 1-4 .6m0-13.1v13.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function SparkIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3v4m0 10v4m9-9h-4M7 12H3m13.5-6.5-2.5 2.5M10 14l-2.5 2.5m9 0L14 14M10 10 7.5 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* Brand marks for the trusted-by marquee — varied shapes per seed */
function BrandMark({ seed }: { seed: number }) {
  const variant = seed % 6;
  const c = "#10231a";
  const common = { className: "h-6 w-6 opacity-70" } as IconProps;
  switch (variant) {
    case 0:
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke={c} strokeWidth="2" />
          <circle cx="12" cy="12" r="3.5" fill={c} />
        </svg>
      );
    case 1:
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none">
          <path d="M12 2 22 20H2L12 2Z" stroke={c} strokeWidth="2" strokeLinejoin="round" />
        </svg>
      );
    case 2:
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="5" stroke={c} strokeWidth="2" />
          <path d="M8 12h8" stroke={c} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 3:
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2 2 7l10 5 10-5-10-5Zm0 10L2 7v10l10 5 10-5V7l-10 5Z"
            stroke={c}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 4:
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none">
          <path
            d="M4 12a8 8 0 0 1 16 0 8 8 0 0 1-16 0Z"
            stroke={c}
            strokeWidth="2"
          />
          <path d="M12 4v16" stroke={c} strokeWidth="2" />
        </svg>
      );
    default:
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3l2.5 5.5L20 11l-5.5 2.5L12 19l-2.5-5.5L4 11l5.5-2.5L12 3Z"
            stroke={c}
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}
