import USHero from "./USHero";
import USValueProps from "./USValueProps";
import USAudience from "./USAudience";
import USOfferings from "./USOfferings";
import USCTA from "./USCTA";

export default function USHomeContent() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
      <USHero />
      <USValueProps />
      <USAudience />
      <USOfferings />
      <USCTA />
    </main>
  );
}
