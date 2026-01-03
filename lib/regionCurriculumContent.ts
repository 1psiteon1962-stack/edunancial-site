import { Language } from "@/lib/language";
import { RegionCurriculumContent } from "@/components/RegionCurriculum";

type RegionContent = Record<Language, RegionCurriculumContent>;

export const regionCurriculumContent: Record<string, RegionContent> = {
  us: {
    en: { heroTitle: "US Curriculum", description: "United States content" },
    es: { heroTitle: "EE.UU.", description: "Contenido de EE.UU." },
    fr: { heroTitle: "États-Unis", description: "Contenu US" },
    de: { heroTitle: "USA", description: "US Inhalt" },
    ar: { heroTitle: "الولايات المتحدة", description: "محتوى أمريكي" },
    zh: { heroTitle: "美国", description: "美国内容" },
    ja: { heroTitle: "アメリカ", description: "米国の内容" },
    hi: { heroTitle: "अमेरिका", description: "अमेरिकी सामग्री" },
  },

  africa: {
    en: { heroTitle: "Africa", description: "Africa content" },
    es: { heroTitle: "África", description: "Contenido África" },
    fr: { heroTitle: "Afrique", description: "Contenu Afrique" },
    de: { heroTitle: "Afrika", description: "Afrika Inhalt" },
    ar: { heroTitle: "أفريقيا", description: "محتوى أفريقيا" },
    zh: { heroTitle: "非洲", description: "非洲内容" },
    ja: { heroTitle: "アフリカ", description: "アフリカの内容" },
    hi: { heroTitle: "अफ्रीका", description: "अफ्रीका सामग्री" },
  },

  mena: {
    en: { heroTitle: "MENA", description: "Middle East & North Africa" },
    es: { heroTitle: "MENA", description: "Medio Oriente y África" },
    fr: { heroTitle: "MENA", description: "Moyen-Orient" },
    de: { heroTitle: "MENA", description: "Naher Osten" },
    ar: { heroTitle: "الشرق الأوسط", description: "محتوى المنطقة" },
    zh: { heroTitle: "中东", description: "中东内容" },
    ja: { heroTitle: "中東", description: "中東の内容" },
    hi: { heroTitle: "मध्य पूर्व", description: "मध्य पूर्व सामग्री" },
  },

  asia: {
    en: { heroTitle: "Asia", description: "Asia content" },
    es: { heroTitle: "Asia", description: "Contenido Asia" },
    fr: { heroTitle: "Asie", description: "Contenu Asie" },
    de: { heroTitle: "Asien", description: "Asien Inhalt" },
    ar: { heroTitle: "آسيا", description: "محتوى آسيا" },
    zh: { heroTitle: "亚洲", description: "亚洲内容" },
    ja: { heroTitle: "アジア", description: "アジアの内容" },
    hi: { heroTitle: "एशिया", description: "एशिया सामग्री" },
  },

  "asia-emerging": {
    en: { heroTitle: "Emerging Asia", description: "Emerging Asia content" },
    es: { heroTitle: "Asia Emergente", description: "Asia emergente" },
    fr: { heroTitle: "Asie émergente", description: "Asie émergente" },
    de: { heroTitle: "Schwellenländer Asien", description: "Asien Wachstum" },
    ar: { heroTitle: "آسيا الناشئة", description: "محتوى ناشئ" },
    zh: { heroTitle: "新兴亚洲", description: "新兴亚洲内容" },
    ja: { heroTitle: "新興アジア", description: "新興アジア" },
    hi: { heroTitle: "उभरता एशिया", description: "उभरता एशिया" },
  },

  "asia-pacific": {
    en: { heroTitle: "Asia-Pacific", description: "APAC content" },
    es: { heroTitle: "Asia-Pacífico", description: "APAC contenido" },
    fr: { heroTitle: "Asie-Pacifique", description: "APAC contenu" },
    de: { heroTitle: "Asien-Pazifik", description: "APAC Inhalt" },
    ar: { heroTitle: "آسيا والمحيط الهادئ", description: "محتوى APAC" },
    zh: { heroTitle: "亚太地区", description: "亚太内容" },
    ja: { heroTitle: "アジア太平洋", description: "APAC内容" },
    hi: { heroTitle: "एशिया-प्रशांत", description: "APAC सामग्री" },
  },

  europe: {
    en: { heroTitle: "Europe", description: "Europe content" },
    es: { heroTitle: "Europa", description: "Contenido Europa" },
    fr: { heroTitle: "Europe", description: "Contenu Europe" },
    de: { heroTitle: "Europa", description: "Europa Inhalt" },
    ar: { heroTitle: "أوروبا", description: "محتوى أوروبا" },
    zh: { heroTitle: "欧洲", description: "欧洲内容" },
    ja: { heroTitle: "ヨーロッパ", description: "ヨーロッパ内容" },
    hi: { heroTitle: "यूरोप", description: "यूरोप सामग्री" },
  },
};
