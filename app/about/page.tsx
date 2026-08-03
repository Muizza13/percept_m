import Link from "next/link";
import { supervisor, team } from "@/lib/team";

const stack = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Tailwind CSS",
  "shadcn/ui",
  "Google Gemini",
  "@google/genai",
  "Zod",
  "LibreOffice",
  "Poppler",
  "Python 3",
  "PyTorch",
  "GPT-2",
];

export default function AboutPage() {
  return (
    <main className="font-body min-h-screen bg-[#0b1711] text-white">
      <section className="mx-auto max-w-4xl px-6 pb-16 pt-36 sm:pt-40">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[13px] text-white/70">
          IUST CSE · Group 10 · Batch 2023–27
        </div>
        <h1 className="font-display text-[40px] font-bold leading-tight tracking-tight sm:text-[52px]">
          About Percept
        </h1>
        <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-white/55">
          Percept is a final-year undergraduate project by three CSE students at
          the Islamic University of Science and Technology, Kashmir. It
          evaluates presentation slides for visual communication quality using a
          vision-language model, with dimensions motivated by cognitive load
          theory (Sweller, 1988), dual coding (Paivio, 1991), and multimedia
          learning (Mayer, 2009).
        </p>
      </section>

      <section className="mx-auto max-w-4xl border-t border-white/[0.06] px-6 pb-16 pt-14">
        <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#c7f04b]">
          The project
        </span>
        <h2 className="font-display mt-4 text-[26px] font-semibold tracking-tight">
          What is Percept?
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <p className="text-[15px] leading-relaxed text-white/55">
            A user uploads a .ppt, .pptx, or .pdf. LibreOffice and Poppler
            convert each page to a PNG image cached on disk. Each image is sent
            to Google Gemini with a fixed JSON schema requesting attention,
            comprehension, and cognitive load scores.
          </p>
          <p className="text-[15px] leading-relaxed text-white/55">
            The model also returns an insight string and recommendations.
            Results are held in sessionStorage and shown on the analysis page.
            Scores are heuristic proxies for visual-communication quality, not
            measurements of neural response. Heatmap overlays are not
            implemented.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl border-t border-white/[0.06] px-6 pb-16 pt-14">
        <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#c7f04b]">
          Built with
        </span>
        <div className="mt-7 flex flex-wrap gap-2.5">
          {stack.map((tech) => (
            <span
              key={tech}
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-[13.5px] text-white/65 transition hover:border-[#c7f04b]/30 hover:text-white"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl border-t border-white/[0.06] px-6 pb-16 pt-14">
        <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#c7f04b]">
          The team
        </span>
        <div className="mt-7 grid gap-5 sm:grid-cols-3">
          {team.map((member) => (
            <div
              key={member.name}
              className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 transition hover:border-[#c7f04b]/30 hover:bg-white/[0.04]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#c7f04b]/25 bg-[#c7f04b]/10 text-[15px] font-semibold text-[#c7f04b]">
                {member.initials}
              </div>
              <p className="font-display mt-5 text-[16px] font-semibold tracking-tight text-white">
                {member.name}
              </p>
              <p className="mt-1 text-[12.5px] text-[#c7f04b]">{member.role}</p>
              <p className="mt-3 text-[13px] leading-relaxed text-white/45">
                {member.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl border-t border-white/[0.06] px-6 pb-16 pt-14">
        <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#c7f04b]">
          Supervised by
        </span>
        <div className="mt-7 flex max-w-sm items-center gap-5 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] text-[15px] font-semibold text-white/80">
            {supervisor.initials}
          </div>
          <div>
            <p className="font-display text-[16px] font-semibold tracking-tight text-white">
              {supervisor.name}
            </p>
            <p className="mt-0.5 text-[12.5px] text-white/40">
              {supervisor.role}
            </p>
            <p className="text-[12.5px] text-white/40">{supervisor.department}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-32 pt-2">
        <div className="relative overflow-hidden rounded-[32px] bg-[#c7f04b] px-8 py-12 text-center text-[#10231a]">
          <div className="pointer-events-none absolute inset-0 bg-blueprint opacity-[0.12]" />
          <div className="relative">
            <h3 className="font-display text-[28px] font-bold tracking-tight">
              Try the pipeline
            </h3>
            <p className="mx-auto mt-3 max-w-sm text-[15px] text-[#10231a]/70">
              Upload a presentation to convert slides and inspect Gemini scores
              on the analysis page.
            </p>
            <Link
              href="/upload"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#10231a] px-7 py-3.5 text-[14px] font-semibold text-white transition hover:bg-[#16321f]"
            >
              Go to upload
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
