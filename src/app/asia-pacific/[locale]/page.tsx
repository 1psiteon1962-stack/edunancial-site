import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { APAC_LOCALES, APAC_LOCALE_CONFIG, getApacHreflangAlternates } from "@/config/asia-pacific/index";
import { getApacCountry } from "@/config/asia-pacific/countries";
import { getApacPricing } from "@/config/asia-pacific/pricing";
import { formatCurrency } from "@/lib/currencyEngine";
import ApacLanguageSelector from "@/components/asia-pacific/LanguageSelector";

type ApacLocale = (typeof APAC_LOCALES)[number];

interface PageProps {
  params: Promise<{ locale: string }>;
}

function isApacLocale(value: string): value is ApacLocale {
  return (APAC_LOCALES as readonly string[]).includes(value);
}

export async function generateStaticParams() {
  return APAC_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isApacLocale(locale)) {
    return {};
  }

  const localeConfig = APAC_LOCALE_CONFIG.find((l) => l.code === locale);
  const siteUrl = "https://www.edunancial.com";
  const hreflangAlternates = getApacHreflangAlternates(siteUrl, "");
  const languagesAlternates = Object.fromEntries(
    hreflangAlternates.map(({ hreflang, href }) => [hreflang, href])
  );

  const titles: Record<ApacLocale, string> = {
    en: "Edunancial Asia-Pacific | Financial Competency",
    ja: "Edunancial アジア太平洋 | 金融リテラシープラットフォーム",
    ko: "Edunancial 아시아태평양 | 금융역량 플랫폼",
    "zh-Hans": "Edunancial 亚太 | 金融能力平台",
    "zh-Hant": "Edunancial 亞太 | 金融能力平台",
    hi: "Edunancial एशिया-प्रशांत | वित्तीय क्षमता मंच",
  };

  return {
    title: titles[locale],
    alternates: {
      canonical: `${siteUrl}/asia-pacific/${locale}`,
      languages: languagesAlternates,
    },
    openGraph: {
      locale: localeConfig?.hreflang.replace("-", "_") ?? "en_SG",
    },
  };
}

export default async function ApacLocalePage({ params }: PageProps) {
  const { locale } = await params;

  if (!isApacLocale(locale)) {
    notFound();
  }

  const localeConfig = APAC_LOCALE_CONFIG.find((l) => l.code === locale);

  if (!localeConfig) {
    notFound();
  }

  const primaryMarketCountry = getApacCountry(localeConfig.primaryMarkets[0]);
  const pricing = getApacPricing(localeConfig.defaultCurrency);

  const headings: Record<ApacLocale, { h1: string; subtitle: string }> = {
    en: {
      h1: "Build Financial Competency",
      subtitle: "Structured education for Asia-Pacific founders and families.",
    },
    ja: {
      h1: "金融リテラシーを身につける",
      subtitle: "アジア太平洋の起業家と家族のための体系的な教育。",
    },
    ko: {
      h1: "금융 역량을 키우세요",
      subtitle: "아시아태평양 창업가와 가정을 위한 체계적인 교육.",
    },
    "zh-Hans": {
      h1: "建立金融能力",
      subtitle: "为亚太创业者和家庭提供系统化教育。",
    },
    "zh-Hant": {
      h1: "建立金融能力",
      subtitle: "為亞太創業者和家庭提供系統化教育。",
    },
    hi: {
      h1: "वित्तीय क्षमता बनाएं",
      subtitle: "एशिया-प्रशांत के उद्यमियों और परिवारों के लिए संरचित शिक्षा।",
    },
  };

  const { h1, subtitle } = headings[locale];

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
            Asia-Pacific · {localeConfig.nativeLabel}
          </p>
          <ApacLanguageSelector currentLocale={locale} />
        </div>

        <h1 className="mt-4 max-w-5xl text-5xl font-black leading-tight md:text-7xl">
          {h1}
        </h1>
        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-300">
          {subtitle}
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/membership"
            className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold hover:bg-blue-700"
          >
            Become a Member
          </Link>
          <Link
            href="/assessment"
            className="rounded-xl border border-white px-8 py-4 text-lg font-bold hover:bg-white hover:text-slate-950"
          >
            Start Assessment
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-3xl font-black text-white">
          {locale === "ja" ? "料金プラン" :
           locale === "ko" ? "요금제" :
           locale === "zh-Hans" ? "价格方案" :
           locale === "zh-Hant" ? "定價方案" :
           locale === "hi" ? "मूल्य योजनाएं" :
           "Pricing Plans"} — {localeConfig.defaultCurrency}
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pricing.products.map((product) => (
            <div
              key={product.sku}
              className="rounded-2xl border border-white/10 bg-slate-900 p-6"
            >
              <p className="text-lg font-bold text-white">{product.label}</p>
              <p className="mt-2 text-3xl font-black text-yellow-400">
                {formatCurrency(product.price, pricing.currency)}
                <span className="ml-1 text-base font-normal text-slate-400">/mo</span>
              </p>
              {product.description && (
                <p className="mt-3 text-slate-300">{product.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {primaryMarketCountry && (
        <section className="mx-auto max-w-7xl px-6 py-12">
          <div className="rounded-2xl border border-white/10 bg-slate-900 p-8">
            <h3 className="text-xl font-black text-white">
              Primary Market: {primaryMarketCountry.name}
            </h3>
            <dl className="mt-4 grid gap-4 md:grid-cols-3 text-slate-300 text-sm">
              <div>
                <dt className="font-bold text-white">Currency</dt>
                <dd>{primaryMarketCountry.currency}</dd>
              </div>
              <div>
                <dt className="font-bold text-white">Timezone</dt>
                <dd>{primaryMarketCountry.timezone}</dd>
              </div>
              <div>
                <dt className="font-bold text-white">Tax Model</dt>
                <dd>{primaryMarketCountry.taxModel.toUpperCase()}</dd>
              </div>
            </dl>
          </div>
        </section>
      )}
    </main>
  );
}
