export type BookCategory = "red" | "white" | "blue";

export interface Ebook {
  id: string;
  title: string;
  author: string;
  description: string;
  category: BookCategory;
  price: number;
  coverImage: string;
  fileUrl: string;
  squareCheckoutUrl: string;
  published: boolean;
}
