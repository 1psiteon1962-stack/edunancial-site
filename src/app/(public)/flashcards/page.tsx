import Link from "next/link";

export const metadata = {
  title: "Practice & Flashcards | Edunancial",
};

const decks = [
  { name: "Real Estate", color: "RED" },
  { name: "Paper Assets", color: "WHITE" },
  { name: "Business", color: "BLUE" },
  { name: "Personal Finance & Taxes", color: "GREEN" },
  { name: "Investing", color: "GOLD" },
  { name: "Law", color: "PURPLE" },
  { name: "Sales & Marketing", color: "ORANGE" },
  { name: "Leadership", color: "BLACK" },
];

export default function FlashCardsPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-yellow-400">Practice</p>
        <h1 className="mt-4 text-5xl font-black md:text-7xl">Flashcards</h1>
        <p className="mt-6 max-w-4xl text-xl leading-9 text-slate-300">
          Core Edunancial flashcards are included with your membership. There is no additional charge and no Marketplace purchase is required.
        </p>
        <p className="mt-3 max-w-4xl text-slate-400">
          Choose a curriculum track to reinforce key concepts. Additional Skills Labs, scenarios, calculators and assessments will live in Practice as they are released.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {decks.map((deck) => (
            <section key={deck.color} className="rounded-2xl border border-white/10 bg-slate-900 p-7">
              <p className="text-xs font-black tracking-[0.2em] text-slate-400">{deck.color}</p>
              <h2 className="mt-3 text-2xl font-black">{deck.name}</h2>
              <p className="mt-4 text-sm leading-6 text-slate-400">Core member flashcards for this Edunancial track.</p>
              <Link
                href={`/flashcards/${deck.color.toLowerCase()}`}
                className="mt-6 inline-block rounded-lg bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
              >
                Open deck
              </Link>
            </section>
          ))}
        </div>
      </section>
    </main>
  );
}
