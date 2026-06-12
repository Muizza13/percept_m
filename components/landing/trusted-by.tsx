import { Circle } from "lucide-react";

const logos = [
  "Lumen Labs",
  "Vertex EDU",
  "Northwind",
  "Cortexa",
  "Helio",
  "Atlas Academy",
] as const;

export function TrustedBy() {
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
              <Circle className="h-5 w-5 fill-[#10231a]/15 stroke-[#10231a]/40" />
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
