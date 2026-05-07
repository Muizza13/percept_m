"use client";
import Link from "next/link";

const team = [
  {
    name: "Salik Yousuf Shigan",
    initials: "SY",
    color: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  },
  {
    name: "Muizza Muayqeeb Akram",
    initials: "MM",
    color: "bg-violet-500/10 border-violet-500/20 text-violet-400",
  },
  {
    name: "Shakeeb Arslan Naqash",
    initials: "SA",
    color: "bg-teal-500/10 border-teal-500/20 text-teal-400",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#020817] text-white overflow-hidden">
      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-8 pt-32 pb-20 flex items-center justify-between gap-12">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex-1 relative z-10">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-full px-4 py-1.5 text-xs text-violet-300 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />
            fMRI-trained neural analysis
          </div>
          <h1 className="text-5xl font-semibold leading-tight mb-6">
            Understand how your
            <br />
            slides <span className="text-blue-400">hit the brain</span>
          </h1>
          <p className="text-white/45 text-lg leading-relaxed mb-8 max-w-md">
            Percept uses brain-trained models to score your slides on attention,
            comprehension, and cognitive load and then generates plain-language
            advice to improve.
          </p>
          <div className="flex gap-4">
            <Link
              href="/upload"
              className="bg-blue-500 hover:bg-blue-600 transition text-white px-6 py-3 rounded-xl text-sm font-medium"
            >
              Analyze your slides
            </Link>
            <Link
              href="#how-it-works"
              className="border border-white/20 hover:border-white/40 transition text-white/60 hover:text-white px-6 py-3 rounded-xl text-sm"
            >
              See how it works
            </Link>
          </div>
        </div>

        {/* Brain orb */}
        <div
          className="relative w-[380px] h-[380px] shrink-0"
          style={{ animation: "float 4s ease-in-out infinite" }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "rgba(139,92,246,0.12)",
              border: "0.5px solid rgba(139,92,246,0.25)",
              animation: "pulse-glow 3s ease-in-out infinite",
            }}
          />
          <div
            className="absolute inset-8 rounded-full"
            style={{
              background: "rgba(59,130,246,0.12)",
              border: "0.5px solid rgba(59,130,246,0.25)",
              animation: "pulse-glow 3s ease-in-out infinite",
              animationDelay: "1s",
            }}
          />
          <div
            className="absolute inset-16 rounded-full"
            style={{
              background: "rgba(6,182,212,0.12)",
              border: "0.5px solid rgba(6,182,212,0.25)",
              animation: "pulse-glow 3s ease-in-out infinite",
              animationDelay: "2s",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="130" height="130" viewBox="0 0 80 80" fill="none">
              <ellipse
                cx="40"
                cy="38"
                rx="28"
                ry="22"
                stroke="#8B5CF6"
                strokeWidth="1"
              />
              <ellipse
                cx="40"
                cy="38"
                rx="20"
                ry="15"
                stroke="#60A5FA"
                strokeWidth="0.8"
              />
              <path
                d="M20 38 Q30 28 40 38 Q50 48 60 38"
                stroke="#2DD4BF"
                strokeWidth="1"
                fill="none"
              />
              <path
                d="M24 32 Q34 24 44 32"
                stroke="#A78BFA"
                strokeWidth="0.8"
                fill="none"
              />
              <path
                d="M24 44 Q34 52 44 44"
                stroke="#A78BFA"
                strokeWidth="0.8"
                fill="none"
              />
              <circle cx="40" cy="38" r="3" fill="#60A5FA" opacity="0.8" />
              <circle cx="28" cy="34" r="1.5" fill="#8B5CF6" opacity="0.6" />
              <circle cx="52" cy="34" r="1.5" fill="#8B5CF6" opacity="0.6" />
              <circle cx="34" cy="46" r="1.5" fill="#2DD4BF" opacity="0.6" />
              <circle cx="46" cy="46" r="1.5" fill="#2DD4BF" opacity="0.6" />
            </svg>
          </div>
        </div>
      </section>

      {/* What is Percept */}
      <section className="max-w-6xl mx-auto px-8 pb-24 border-t border-white/[0.06] pt-16">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-4">
          What is Percept?
        </p>
        <h2 className="text-3xl font-semibold mb-8">
          Built for educators who want
          <br />
          to actually be understood
        </h2>
        <div className="grid grid-cols-2 gap-8">
          <p className="text-white/50 text-sm leading-relaxed">
            Most presentation tools tell you nothing about whether your slides
            actually work. Percept fixes that by running each slide through a
            neural encoding model trained on fMRI brain data, predicting how the
            human brain responds to what it sees.
          </p>
          <p className="text-white/50 text-sm leading-relaxed">
            The result is three cognitive scores per slide, attention,
            comprehension, and cognitive load, paired with a Grad-CAM heatmap
            showing exactly where the brain focuses, and plain-language advice
            to help you improve.
          </p>
        </div>
      </section>

      {/* Score cards */}
      <section className="max-w-6xl mx-auto px-8 pb-24 grid grid-cols-3 gap-4">
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
          <p className="text-xs text-white/40 mb-2">Attention score</p>
          <p className="text-4xl font-medium text-blue-400">
            87<span className="text-lg text-white/25">/100</span>
          </p>
          <p className="text-xs text-white/25 mt-1">Above average</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
          <p className="text-xs text-white/40 mb-2">Comprehension</p>
          <p className="text-4xl font-medium text-violet-400">
            72<span className="text-lg text-white/25">/100</span>
          </p>
          <p className="text-xs text-white/25 mt-1">Needs improvement</p>
        </div>
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
          <p className="text-xs text-white/40 mb-2">Cognitive load</p>
          <p className="text-4xl font-medium text-teal-400">Low</p>
          <p className="text-xs text-white/25 mt-1">Optimal range</p>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="max-w-6xl mx-auto px-8 pb-24 border-t border-white/[0.06] pt-16"
      >
        <p className="text-xs text-white/30 uppercase tracking-widest mb-3">
          How it works
        </p>
        <h2 className="text-3xl font-semibold mb-12">
          From slide to brain insight
          <br />
          in three steps
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            {
              num: "01",
              title: "Upload your slide",
              desc: "Drop a .ppt, .pptx or .pdf. We convert every slide into a clean image ready for analysis.",
              color: "border-blue-500/20 bg-blue-500/[0.04]",
              accent: "text-blue-400",
            },
            {
              num: "02",
              title: "Model analyzes it",
              desc: "TRIBE v2 predicts how the brain responds. Grad-CAM maps exactly where attention lands.",
              color: "border-violet-500/20 bg-violet-500/[0.04]",
              accent: "text-violet-400",
            },
            {
              num: "03",
              title: "Get actionable advice",
              desc: "Three cognitive scores plus LLM-generated plain-English suggestions to improve each slide.",
              color: "border-teal-500/20 bg-teal-500/[0.04]",
              accent: "text-teal-400",
            },
          ].map((step) => (
            <div
              key={step.num}
              className={`border rounded-2xl p-7 ${step.color}`}
            >
              <p className={`text-xs font-medium mb-5 ${step.accent}`}>
                {step.num}
              </p>
              <p className="text-base font-medium text-white mb-3">
                {step.title}
              </p>
              <p className="text-sm text-white/40 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* About the makers */}
      <section className="max-w-6xl mx-auto px-8 pb-32 border-t border-white/[0.06] pt-16">
        <p className="text-xs text-white/30 uppercase tracking-widest mb-8">
          The builders
        </p>
        <div className="grid grid-cols-3 gap-6 mb-12">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-6 hover:border-white/[0.12] transition"
            >
              <div
                className={`w-12 h-12 rounded-xl border flex items-center justify-center text-sm font-medium mb-4 ${member.color}`}
              >
                {member.initials}
              </div>
              <p className="text-sm font-medium text-white">{member.name}</p>
              <p className="text-xs text-white/30 mt-1">
                IUST CSE · Batch 2023-27
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-5 bg-white/[0.02] border border-white/[0.07] rounded-2xl p-6 max-w-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-sm font-medium text-amber-400">
            SS
          </div>
          <div>
            <p className="text-sm font-medium text-white">Dr. Sahil Sholla</p>
            <p className="text-xs text-white/40 mt-0.5">Supervisor</p>
            <p className="text-xs text-white/30">
              Department of CSE, IUST Kashmir
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
