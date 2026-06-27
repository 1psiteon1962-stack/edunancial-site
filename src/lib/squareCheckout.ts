export interface CheckoutItem {
  id: string;
  name: string;
  price: number;
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
    throw new Error("Checkout failed.");
  }

  const data = await response.json();

  window.location.href = data.checkoutUrl;
}
