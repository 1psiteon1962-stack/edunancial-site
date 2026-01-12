export default function LevelGate() {
  const userLevel = 2;

  if (userLevel < 3) {
    return (
      <main style={{ padding: "40px" }}>
        <h1>Upgrade Required</h1>
        <p>This feature unlocks at Level 3.</p>
        <a href="/us/l3">Upgrade Now</a>
      </main>
    );
  }

  return (
    <main style={{ padding: "40px" }}>
      <h1>Access Granted</h1>
      <p>Welcome to growth-level tools.</p>
    </main>
  );
}
