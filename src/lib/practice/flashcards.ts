export const FLASHCARD_TRACKS = ["red", "white", "blue", "green", "gold", "purple", "orange", "black"] as const;
export type FlashcardTrack = (typeof FLASHCARD_TRACKS)[number];

export type FlashcardDeck = {
  track: FlashcardTrack;
  label: string;
  subject: string;
  href: string;
  includedWithMembership: true;
};

export const FLASHCARD_DECKS: FlashcardDeck[] = [
  { track: "red", label: "Red", subject: "Real Estate", href: "/flashcards/red", includedWithMembership: true },
  { track: "white", label: "White", subject: "Paper Assets", href: "/flashcards/white", includedWithMembership: true },
  { track: "blue", label: "Blue", subject: "Business", href: "/flashcards/blue", includedWithMembership: true },
  { track: "green", label: "Green", subject: "Personal Finance & Taxes", href: "/flashcards/green", includedWithMembership: true },
  { track: "gold", label: "Gold", subject: "Investing", href: "/flashcards/gold", includedWithMembership: true },
  { track: "purple", label: "Purple", subject: "Law", href: "/flashcards/purple", includedWithMembership: true },
  { track: "orange", label: "Orange", subject: "Sales & Marketing", href: "/flashcards/orange", includedWithMembership: true },
  { track: "black", label: "Black", subject: "Leadership", href: "/flashcards/black", includedWithMembership: true },
];

export function isFlashcardTrack(value: string): value is FlashcardTrack {
  return FLASHCARD_TRACKS.includes(value as FlashcardTrack);
}
