// ======================================================
// AFRICA REGIONAL FOUNDATION
// africa.ts – Curriculum content for the Africa region
// ======================================================

import type { CurriculumLanguageContent } from "@/lib/types/curriculum";

export interface AfricaCurriculumContent {
  en: CurriculumLanguageContent;
  fr: CurriculumLanguageContent;
  ar: CurriculumLanguageContent;
  pt: CurriculumLanguageContent;
}

export const africaCurriculumContent: AfricaCurriculumContent = {
  en: {
    sections: [
      {
        title: "Financial Systems in Africa",
        description:
          "Understand how African financial systems operate, including mobile money, banking access, capital markets, and the role of fintech in accelerating financial inclusion across the continent.",
      },
      {
        title: "Business Formation and Compliance",
        description:
          "Learn how to form and operate a business in key African markets, covering entity types, regulatory compliance, tax obligations, and cross-border trade within the African Continental Free Trade Area (AfCFTA).",
      },
      {
        title: "Entrepreneurship and Startup Ecosystem",
        description:
          "Explore Africa's fast-growing startup ecosystem, access to venture capital, angel networks, government grants, and strategies for scaling across multiple African countries.",
      },
    ],
  },
  fr: {
    sections: [
      {
        title: "Systèmes Financiers en Afrique",
        description:
          "Comprendre le fonctionnement des systèmes financiers africains, notamment la monnaie mobile, l'accès bancaire, les marchés de capitaux et le rôle de la fintech dans l'inclusion financière.",
      },
      {
        title: "Création d'Entreprise et Conformité",
        description:
          "Apprendre à créer et exploiter une entreprise sur les marchés africains clés, en couvrant les types d'entités, la conformité réglementaire, les obligations fiscales et le commerce transfrontalier dans le cadre de la ZLECAF.",
      },
      {
        title: "Entrepreneuriat et Écosystème des Startups",
        description:
          "Explorer l'écosystème africain des startups en pleine croissance, les sources de financement, les réseaux d'investisseurs providentiels, les subventions gouvernementales et les stratégies de croissance.",
      },
    ],
  },
  ar: {
    sections: [
      {
        title: "الأنظمة المالية في أفريقيا",
        description:
          "فهم كيفية عمل الأنظمة المالية الأفريقية، بما في ذلك النقود المتنقلة، وإمكانية الوصول إلى الخدمات المصرفية، وأسواق رأس المال، ودور التكنولوجيا المالية في تسريع الشمول المالي.",
      },
      {
        title: "تأسيس الأعمال والامتثال",
        description:
          "تعلم كيفية تأسيس وإدارة الأعمال في الأسواق الأفريقية الرئيسية، بما يشمل أنواع الكيانات، والامتثال التنظيمي، والالتزامات الضريبية، والتجارة عبر الحدود في إطار منطقة التجارة الحرة القارية الأفريقية.",
      },
      {
        title: "ريادة الأعمال ومنظومة الشركات الناشئة",
        description:
          "استكشاف منظومة الشركات الناشئة الأفريقية سريعة النمو، وفرص التمويل الجريء، وشبكات المستثمرين الملاك، والمنح الحكومية، واستراتيجيات التوسع.",
      },
    ],
  },
  pt: {
    sections: [
      {
        title: "Sistemas Financeiros em África",
        description:
          "Compreender o funcionamento dos sistemas financeiros africanos, incluindo dinheiro móvel, acesso a serviços bancários, mercados de capitais e o papel das fintechs na inclusão financeira.",
      },
      {
        title: "Constituição de Empresas e Conformidade",
        description:
          "Aprender a constituir e operar uma empresa nos principais mercados africanos, abrangendo tipos de entidades, conformidade regulatória, obrigações fiscais e comércio transfronteiriço no âmbito da AfCFTA.",
      },
      {
        title: "Empreendedorismo e Ecossistema de Startups",
        description:
          "Explorar o ecossistema de startups africano em rápido crescimento, fontes de capital de risco, redes de investidores anjo, subsídios governamentais e estratégias de expansão.",
      },
    ],
  },
};
