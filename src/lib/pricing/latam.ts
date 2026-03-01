import type { Pricing } from "./types";

export const LATAM_PRICING: Pricing = {
  currency: "USD",
  products: [
    {
      sku: "entry",
      price: 2.99,
      label: "Entrada",
      description: "Empieza con lo esencial.",
      features: ["Lecciones básicas", "Herramientas", "Soporte por email"],
    },
    {
      sku: "core",
      price: 5.99,
      label: "Núcleo",
      description: "Para avanzar con disciplina.",
      features: ["Todo lo de Entrada", "Seguimiento KPI", "Comunidad"],
    },
    {
      sku: "pro",
      price: 11.99,
      label: "Pro",
      description: "Para construir y escalar con estructura.",
      features: ["Todo lo de Núcleo", "Plantillas avanzadas", "Soporte prioritario"],
    },
  ],
};
