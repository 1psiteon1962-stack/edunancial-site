export default function USLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav style={{ padding: "20px", borderBottom: "1px solid #ddd" }}>
        <a href="/us">US Home</a> |{" "}
        <a href="/us/l1">L1</a> |{" "}
        <a href="/us/l2">L2</a> |{" "}
        <a href="/us/l3">L3</a> |{" "}
        <a href="/us/l4">L4</a> |{" "}
        <a href="/us/l5">L5</a>
      </nav>

      <div>{children}</div>
    </div>
  );
}
