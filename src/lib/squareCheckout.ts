export interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  currency: string;
  memberEmail?: string;
}

export async function startSquareCheckout(
  item: CheckoutItem
) {
  const response = await fetch("/api/square/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;

    throw new Error(
      errorBody?.error ?? "Secure checkout is unavailable right now."
    );
  }

  const data = await response.json();

  window.location.href = data.checkoutUrl;
}
