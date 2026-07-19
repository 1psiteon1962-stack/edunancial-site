import { redirect } from "next/navigation";

export const metadata = {
  title: "Marketplace | Edunancial",
  description:
    "Browse Edunancial digital products in the Marketplace.",
};

export default function BooksPage() {
  redirect("/marketplace");
}
