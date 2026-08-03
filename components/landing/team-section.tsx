import { supervisor, team } from "@/lib/team";

export function TeamSection() {
  return (
    <section id="team" className="bg-[#0b1711] px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#c7f04b]">
            Project team
          </span>
          <h2 className="font-display mt-4 text-[34px] font-bold tracking-tight sm:text-[42px]">
            Group 10 · IUST CSE
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-relaxed text-white/50">
            Final-year undergraduate project, Department of Computer Science and
            Engineering, Islamic University of Science and Technology, Kashmir.
            Supervisor: Dr. Sahil Sholla, Assistant Professor.
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
            {supervisor.initials}
          </div>
          <div>
            <p className="font-display text-[17px] font-semibold tracking-tight text-white">
              {supervisor.name}
            </p>
            <p className="mt-0.5 text-[13px] text-[#c7f04b]">
              {supervisor.role}
            </p>
            <p className="text-[13px] text-white/40">{supervisor.department}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
