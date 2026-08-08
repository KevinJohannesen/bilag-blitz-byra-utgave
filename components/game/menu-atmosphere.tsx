"use client"

const PREVIEW = [
  { company: "Fjord Handel AS", text: "Husleie for kontorlokaler", amount: "18 500", delay: "0s", x: "12%" },
  { company: "Oslo Regnskap AS", text: "MVA-delen utgående på salg", amount: "6 250", delay: "1.4s", x: "58%" },
  { company: "Polar Råd AS", text: "Abonnement på regnskapsprogram", amount: "1 490", delay: "2.8s", x: "34%" },
]

export function MenuAtmosphere() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.35]"
      aria-hidden
    >
      {PREVIEW.map((card) => (
        <div
          key={card.company}
          className="animate-menu-drift absolute w-44 rounded-md border border-ink/10 bg-[#fffef8] px-3 py-2 shadow-md"
          style={{ left: card.x, animationDelay: card.delay }}
        >
          <p className="truncate text-[10px] font-semibold text-ink/70">{card.company}</p>
          <p className="mt-1 text-[11px] leading-snug text-ink/55">{card.text}</p>
          <p className="mt-1 font-mono text-[11px] text-stamp">kr {card.amount}</p>
        </div>
      ))}
      <div className="absolute inset-x-8 bottom-10 h-px border-t-2 border-dashed border-danger/40" />
    </div>
  )
}
