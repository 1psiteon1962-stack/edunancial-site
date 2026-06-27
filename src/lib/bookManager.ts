import { Ebook } from "./bookTypes";
import { ebooks } from "./books";

export function getBooks(): Ebook[] {
  return ebooks.filter(book => book.published);
}

export function getBook(id: string) {
  return ebooks.find(book => book.id === id);
}

export function getBooksByCategory(category: string) {
  return ebooks.filter(
    book =>
      book.category === category &&
      book.published
  );
}

export function getFeaturedBooks(limit = 3) {
  return ebooks
    .filter(book => book.published)
    .slice(0, limit);
}
