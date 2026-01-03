// components/RegionCurriculum.tsx
import { Region } from "@/lib/language";

export type RegionCurriculumContent = {
  heroTitle: string;
  description: string;
};

export default function RegionCurriculum({
  region,
}: {
  region: Region;
}) {
  return (
    <section>
      <h2>{region.toUpperCase()} Curriculum</h2>
      <p>
        This curriculum adapts financial literacy principles to the realities
        of the region.
      </p>
    </section>
  );
}
