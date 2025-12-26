import CheckoutClient from "./CheckoutClient";

export const metadata = {
  title: "Checkout | Edunancial",
};

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <CheckoutClient />
    </main>
  );
}
