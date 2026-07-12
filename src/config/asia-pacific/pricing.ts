import type { Pricing } from "@/lib/pricing/types";

export const APAC_PRICING_BY_CURRENCY: Record<string, Pricing> = {
  USD: {
    currency: "USD",
    products: [
      { sku: "entry", price: 2.49, label: "Entry", description: "Foundational finance + discipline." },
      { sku: "core", price: 6.99, label: "Core", description: "Operations, KPIs, and consistency." },
      { sku: "pro", price: 13.99, label: "Pro", description: "Scaling frameworks and advanced tools." },
    ],
  },
  JPY: {
    currency: "JPY",
    products: [
      { sku: "entry", price: 380, label: "エントリー", description: "財務の基礎と規律。" },
      { sku: "core", price: 1080, label: "コア", description: "業務、KPI、一貫性。" },
      { sku: "pro", price: 2180, label: "プロ", description: "スケーリングフレームワークと高度なツール。" },
    ],
  },
  KRW: {
    currency: "KRW",
    products: [
      { sku: "entry", price: 3300, label: "입문", description: "재무 기초와 규율." },
      { sku: "core", price: 9200, label: "코어", description: "운영, KPI, 일관성." },
      { sku: "pro", price: 18500, label: "프로", description: "확장 프레임워크 및 고급 도구." },
    ],
  },
  CNY: {
    currency: "CNY",
    products: [
      { sku: "entry", price: 18, label: "入门版", description: "财务基础与规律。" },
      { sku: "core", price: 50, label: "核心版", description: "运营、KPI 与一致性。" },
      { sku: "pro", price: 99, label: "专业版", description: "规模化框架与高级工具。" },
    ],
  },
  TWD: {
    currency: "TWD",
    products: [
      { sku: "entry", price: 79, label: "入門版", description: "財務基礎與規律。" },
      { sku: "core", price: 220, label: "核心版", description: "營運、KPI 與一致性。" },
      { sku: "pro", price: 440, label: "專業版", description: "擴展框架與進階工具。" },
    ],
  },
  HKD: {
    currency: "HKD",
    products: [
      { sku: "entry", price: 19, label: "入門版", description: "財務基礎與規律。" },
      { sku: "core", price: 55, label: "核心版", description: "營運、KPI 與一致性。" },
      { sku: "pro", price: 109, label: "專業版", description: "擴展框架與進階工具。" },
    ],
  },
  SGD: {
    currency: "SGD",
    products: [
      { sku: "entry", price: 3.49, label: "Entry", description: "Foundational finance + discipline." },
      { sku: "core", price: 9.49, label: "Core", description: "Operations, KPIs, and consistency." },
      { sku: "pro", price: 18.99, label: "Pro", description: "Scaling frameworks and advanced tools." },
    ],
  },
  INR: {
    currency: "INR",
    products: [
      { sku: "entry", price: 199, label: "बेसिक", description: "वित्तीय बुनियाद और अनुशासन।" },
      { sku: "core", price: 579, label: "कोर", description: "संचालन, KPI, और निरंतरता।" },
      { sku: "pro", price: 1149, label: "प्रो", description: "स्केलिंग फ्रेमवर्क और उन्नत टूल्स।" },
    ],
  },
  AUD: {
    currency: "AUD",
    products: [
      { sku: "entry", price: 3.99, label: "Entry", description: "Foundational finance + discipline." },
      { sku: "core", price: 10.99, label: "Core", description: "Operations, KPIs, and consistency." },
      { sku: "pro", price: 21.99, label: "Pro", description: "Scaling frameworks and advanced tools." },
    ],
  },
  NZD: {
    currency: "NZD",
    products: [
      { sku: "entry", price: 4.49, label: "Entry", description: "Foundational finance + discipline." },
      { sku: "core", price: 11.99, label: "Core", description: "Operations, KPIs, and consistency." },
      { sku: "pro", price: 23.99, label: "Pro", description: "Scaling frameworks and advanced tools." },
    ],
  },
  PHP: {
    currency: "PHP",
    products: [
      { sku: "entry", price: 139, label: "Entry", description: "Foundational finance + discipline." },
      { sku: "core", price: 389, label: "Core", description: "Operations, KPIs, and consistency." },
      { sku: "pro", price: 779, label: "Pro", description: "Scaling frameworks and advanced tools." },
    ],
  },
};

export function getApacPricing(currency: string): Pricing {
  return APAC_PRICING_BY_CURRENCY[currency] ?? APAC_PRICING_BY_CURRENCY["USD"];
}
