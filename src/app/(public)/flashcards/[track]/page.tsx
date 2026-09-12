import Link from "next/link";
import { notFound } from "next/navigation";
import { FLASHCARD_DECKS, isFlashcardTrack } from "@/lib/practice/flashcards";

type Props = { params: Promise<{ track: string }> };

export default async function FlashcardDeckPage({ params }: Props) {
  const { track } = await params;
  if (!isFlashcardTrack(track)) notFound();
  const deck = FLASHCARD_DECKS.find((item) => item.track === track)!;
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-5xl px-6 py-20">
        <Link href="/flashcards" className="text-sm font-bold text-blue-300 hover:text-blue-200">← All flashcards</Link>
        <p className="mt-10 text-sm font-black uppercase tracking-[0.3em] text-yellow-400">Practice · {deck.label}</p>
        <h1 className="mt-4 text-5xl font-black">{deck.subject} Flashcards</h1>
        <p className="mt-6 max-w-3xl text-xl leading-9 text-slate-300">This core deck is included with Edunancial membership. No Marketplace purchase is required.</p>
        <div className="mt-12 rounded-2xl border border-white/10 bg-slate-900 p-8">
          <h2 className="text-2xl font-black">Practice deck</h2>
          <p className="mt-3 leading-7 text-slate-400">Flashcard content for this track is delivered as included membership Practice content.</p>
        </div>
      </section>
    </main>
  );
}
