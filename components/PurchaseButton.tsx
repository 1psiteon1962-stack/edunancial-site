type Props = {
  label: string;
};

export function PurchaseButton({ label }: Props) {
  return (
    <button disabled style={{ opacity: 0.5 }}>
      {label} (Payments Coming Soon)
    </button>
  );
}
