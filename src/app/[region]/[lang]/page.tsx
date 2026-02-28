import { getRegion } from "@/lib/regions";
import { isLanguage } from "@/lib/i18n/languages";
import { getDictionary } from "@/lib/i18n/getDictionary";

export default async function Page({
  params
}: {
  params: { region: string; lang: string };
}) {
  const region = getRegion(params.region);

  if (!region) return <div>Invalid region</div>;

  const lang = isLanguage(params.lang)
    ? params.lang
    : region.defaultLanguage;

  const dict = await getDictionary(lang);

  return (
    <main>
      <h1>{dict.hero_title}</h1>
      <p>{dict.hero_subtitle}</p>
      <button>{dict.cta_start}</button>
    </main>
  );
}
