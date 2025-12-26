export default function CheckoutPage({
  searchParams,
}: {
  searchParams: {
    offer?: string;
    price?: string;
    region?: string;
  };
}) {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>Confirm Access</h1>

      <p><strong>Offer:</strong> {searchParams.offer}</p>
      <p><strong>Region:</strong> {searchParams.region}</p>
      <p><strong>Price:</strong> ${searchParams.price}</p>

      <button
        style={{
          marginTop: "1rem",
          padding: "0.75rem 1.25rem",
          background: "#000",
          color: "#fff",
        }}
      >
        Pay & Continue
      </button>
    </main>
  );
}
