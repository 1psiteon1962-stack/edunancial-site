export default function RegionHome({ params }: { params: { region: string } }) {
  return (
    <main style={{ padding: "3rem" }}>
      <h1>Edunancial — {params.region.toUpperCase()}</h1>
      <p>Region: {params.region}</p>
      <p>This region is now live.</p>
    </main>
  )
}
