import { redirect } from "next/navigation";

/**
 * /books is now part of the Edunancial Marketplace.
 * Books and all educational products live under /marketplace/learn.
 */
export default function BooksRedirectPage() {
  redirect("/marketplace/learn");
}
