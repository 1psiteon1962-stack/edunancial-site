import { Ebook } from "./bookTypes";

const STORAGE_KEY = "edunancial-books";

export function saveBooks(books: Ebook[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(books)
  );
}

export function loadBooks(): Ebook[] {
  if (typeof window === "undefined") return [];

  const books = localStorage.getItem(STORAGE_KEY);

  if (!books) return [];

  return JSON.parse(books);
}

export function clearBooks() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEY);
}
