import { getRegionContent } from "@/lib/regions/config";

export default function RootPage() {
  const regionContent = getRegionContent("root");

  const { clientModules } = regionContent;

  return (
    <main>
      {clientModules.map((Module: any, index: number) => (
        <Module key={index} />
      ))}
    </main>
  );
}
