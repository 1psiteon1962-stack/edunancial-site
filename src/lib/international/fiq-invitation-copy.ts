import { normalizeLanguageCode } from "./languages";

export type FiqInvitationCopy = {
  eyebrow: string;
  title: string;
  body: string;
  languageLabel: string;
  accept: string;
  decline: string;
};

const en: FiqInvitationCopy = {
  eyebrow: "Free Financial Intelligence Quiz",
  title: "Want to take the free Edunancial FIQ?",
  body: "The Edunancial Financial Intelligence Quiz (Edunancial FIQ) helps you measure your current financial knowledge and identify areas to strengthen. It is for educational, informational, and/or recreational purposes only and does not provide financial, legal, tax, investment, or other professional advice.",
  languageLabel: "What language would you like to use for the FIQ?",
  accept: "Yes — Take the Free FIQ",
  decline: "No — Explore the Website",
};

const es: FiqInvitationCopy = {
  eyebrow: "Prueba gratuita de inteligencia financiera",
  title: "¿Quieres tomar el FIQ gratuito de Edunancial?",
  body: "La Prueba de Inteligencia Financiera de Edunancial (Edunancial FIQ) te ayuda a medir tus conocimientos financieros actuales e identificar las áreas que debes fortalecer. Es solo para fines educativos, informativos y/o recreativos, y no constituye asesoría financiera, legal, tributaria, de inversión ni de ningún otro tipo profesional.",
  languageLabel: "¿En qué idioma quieres tomar el FIQ?",
  accept: "Sí — Tomar el FIQ gratis",
  decline: "No — Explorar el sitio",
};

const frCA: FiqInvitationCopy = {
  eyebrow: "Questionnaire gratuit d’intelligence financière",
  title: "Voulez-vous faire le FIQ gratuit d’Edunancial?",
  body: "Le questionnaire d’intelligence financière d’Edunancial (Edunancial FIQ) vous aide à mesurer vos connaissances financières actuelles et à repérer les points à renforcer. Il est offert à des fins éducatives, informatives et/ou récréatives seulement et ne constitue pas un conseil financier, juridique, fiscal, en placement ni aucun autre conseil professionnel.",
  languageLabel: "Dans quelle langue voulez-vous faire le FIQ?",
  accept: "Oui — Faire le FIQ gratuit",
  decline: "Non — Explorer le site",
};

const frFR: FiqInvitationCopy = {
  ...frCA,
  title: "Voulez-vous passer le FIQ gratuit d’Edunancial ?",
  body: "Le questionnaire d’intelligence financière d’Edunancial (Edunancial FIQ) vous aide à mesurer vos connaissances financières actuelles et à identifier les points à renforcer. Il est proposé à des fins éducatives, informatives et/ou récréatives uniquement et ne constitue pas un conseil financier, juridique, fiscal, en investissement ni aucun autre conseil professionnel.",
  languageLabel: "Dans quelle langue souhaitez-vous passer le FIQ ?",
  accept: "Oui — Passer le FIQ gratuit",
};

const ptBR: FiqInvitationCopy = {
  eyebrow: "Teste gratuito de inteligência financeira",
  title: "Quer fazer o FIQ gratuito da Edunancial?",
  body: "O Teste de Inteligência Financeira da Edunancial (Edunancial FIQ) ajuda você a medir seu conhecimento financeiro atual e identificar áreas para fortalecer. Destina-se apenas a fins educacionais, informativos e/ou recreativos e não constitui aconselhamento financeiro, jurídico, tributário, de investimento ou qualquer outro aconselhamento profissional.",
  languageLabel: "Em qual idioma você quer fazer o FIQ?",
  accept: "Sim — Fazer o FIQ gratuito",
  decline: "Não — Explorar o site",
};

const ptPT: FiqInvitationCopy = {
  ...ptBR,
  title: "Quer fazer o FIQ gratuito da Edunancial?",
  body: "O Teste de Inteligência Financeira da Edunancial (Edunancial FIQ) ajuda-o a medir os seus conhecimentos financeiros atuais e a identificar áreas a reforçar. Destina-se apenas a fins educativos, informativos e/ou recreativos e não constitui aconselhamento financeiro, jurídico, fiscal, de investimento ou qualquer outro aconselhamento profissional.",
  languageLabel: "Em que idioma pretende fazer o FIQ?",
};

const de: FiqInvitationCopy = {
  eyebrow: "Kostenloser Finanzintelligenz-Test",
  title: "Möchten Sie den kostenlosen Edunancial FIQ machen?",
  body: "Der Edunancial Finanzintelligenz-Test (Edunancial FIQ) hilft Ihnen, Ihr aktuelles Finanzwissen einzuschätzen und Bereiche zu erkennen, die Sie stärken sollten. Er dient ausschließlich Bildungs-, Informations- und/oder Freizeitzwecken und stellt keine Finanz-, Rechts-, Steuer-, Anlage- oder sonstige professionelle Beratung dar.",
  languageLabel: "In welcher Sprache möchten Sie den FIQ machen?",
  accept: "Ja — Kostenlosen FIQ starten",
  decline: "Nein — Website erkunden",
};

const it: FiqInvitationCopy = {
  eyebrow: "Quiz gratuito di intelligenza finanziaria",
  title: "Vuoi fare il FIQ gratuito di Edunancial?",
  body: "Il Quiz di Intelligenza Finanziaria di Edunancial (Edunancial FIQ) ti aiuta a misurare le tue attuali conoscenze finanziarie e a individuare le aree da rafforzare. È destinato esclusivamente a scopi educativi, informativi e/o ricreativi e non costituisce consulenza finanziaria, legale, fiscale, d’investimento o di altro tipo professionale.",
  languageLabel: "In quale lingua vuoi fare il FIQ?",
  accept: "Sì — Fai il FIQ gratuito",
  decline: "No — Esplora il sito",
};

const nl: FiqInvitationCopy = {
  eyebrow: "Gratis financiële intelligentietest",
  title: "Wil je de gratis Edunancial FIQ doen?",
  body: "De Edunancial Financiële Intelligentietest (Edunancial FIQ) helpt je je huidige financiële kennis te meten en te ontdekken waar je sterker kunt worden. Hij is uitsluitend bedoeld voor educatieve, informatieve en/of recreatieve doeleinden en vormt geen financieel, juridisch, fiscaal, beleggings- of ander professioneel advies.",
  languageLabel: "In welke taal wil je de FIQ doen?",
  accept: "Ja — Doe de gratis FIQ",
  decline: "Nee — Bekijk de website",
};

export function getFiqInvitationCopy(languageCode: string): FiqInvitationCopy {
  const locale = normalizeLanguageCode(languageCode);
  const base = locale.toLowerCase().split("-")[0];
  if (locale === "fr-CA") return frCA;
  if (base === "fr") return frFR;
  if (locale === "pt-PT") return ptPT;
  if (base === "pt") return ptBR;
  if (base === "es") return es;
  if (base === "de") return de;
  if (base === "it") return it;
  if (base === "nl") return nl;
  return en;
}
