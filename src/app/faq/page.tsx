import BilingualContent from "@/components/international/BilingualContent";
import {
  EDUNANCIAL_IDENTITY,
  EDUNANCIAL_PUBLIC_DISCLAIMER,
} from "@/lib/positioning";

export const metadata = {
  title: "Frequently Asked Questions",
};

const enFaqs = [
  {
    question: "What is Edunancial?",
    answer: `${EDUNANCIAL_IDENTITY} It helps members improve practical financial judgment through learning resources, assessments, tools, and guided support.`,
  },
  {
    question: "What do Red, White, and Blue mean?",
    answer:
      "Red covers Real Estate, White covers Paper Assets, and Blue covers Business. These three pillars remain the foundation of the platform.",
  },
  {
    question: "How do memberships work?",
    answer:
      "Individual Membership is $19.99/month. Approved Organization Membership is $14.99/member/month for approved partners. The 100+ Member Organization Rate is $9.99 per active paid member/month with a minimum of 100 active paid members and a formal agreement.",
  },
  {
    question: "Is Edunancial a school or accredited institution?",
    answer: EDUNANCIAL_PUBLIC_DISCLAIMER,
  },
  {
    question: "Can I earn certificates?",
    answer:
      "Members may receive Certificates of Completion for Edunancial modules. These are completion recognitions only and are not academic degrees, licenses, or regulated credentials.",
  },
  {
    question: "How does Beta Tester access work?",
    answer:
      "Beta Tester access is $0, invitation only, tied to an approved email address, and begins at first successful login after valid redemption. Access expires 72 hours later unless an administrator explicitly extends it.",
  },
];

const esFaqs = [
  {
    question: "¿Qué es Edunancial?",
    answer:
      "Edunancial es una plataforma de membresía de alfabetización financiera y competencia financiera. Ayuda a los miembros a fortalecer su criterio financiero práctico mediante recursos de aprendizaje, evaluaciones, herramientas y apoyo guiado.",
  },
  {
    question: "¿Qué significan Red, White y Blue?",
    answer:
      "Red representa bienes raíces, White representa activos financieros y Blue representa negocios. Estos tres pilares siguen siendo la base del recorrido de aprendizaje.",
  },
  {
    question: "¿Cómo funcionan las membresías?",
    answer:
      "La Membresía Individual cuesta $19.99 al mes. La Membresía para Organizaciones Aprobadas cuesta $14.99 por miembro al mes para socios aprobados. La tarifa para organizaciones con 100+ miembros cuesta $9.99 por miembro activo de pago al mes y requiere un mínimo de 100 miembros activos y un acuerdo formal.",
  },
  {
    question: "¿Edunancial es una escuela o institución acreditada?",
    answer:
      "Edunancial no es una escuela, colegio, universidad, institución vocacional, institución educativa acreditada ni una institución que otorgue títulos. La membresía no produce un grado académico, diploma, licencia profesional ni una credencial educativa regulada.",
  },
  {
    question: "¿Puedo obtener certificados?",
    answer:
      "Los miembros pueden recibir certificados de finalización por módulos de Edunancial. Son reconocimientos de finalización y no títulos académicos, licencias ni credenciales reguladas.",
  },
  {
    question: "¿Cómo funciona el acceso beta?",
    answer:
      "El acceso para probadores beta cuesta $0, es solo por invitación, está vinculado a un correo aprobado y comienza en el primer inicio de sesión exitoso después del canje válido. Expira 72 horas después, salvo que un administrador lo extienda de forma explícita.",
  },
];

export default function FAQPage() {
  return (
    <BilingualContent
      en={
        <main className="min-h-screen bg-[#08101f] text-white">
          <section className="mx-auto max-w-6xl px-6 py-24">
            <p className="uppercase tracking-[0.45em] text-yellow-400 font-bold">FAQ</p>
            <h1 className="mt-6 text-6xl font-black">Frequently Asked Questions</h1>

            <div className="mt-20 space-y-6">
              {enFaqs.map((faq) => (
                <div key={faq.question} className="rounded-xl bg-slate-900 p-8">
                  <h2 className="text-2xl font-black">{faq.question}</h2>
                  <p className="mt-4 leading-8 text-slate-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      }
      es={
        <main className="min-h-screen bg-[#08101f] text-white">
          <section className="mx-auto max-w-6xl px-6 py-24">
            <p className="uppercase tracking-[0.45em] text-yellow-400 font-bold">Preguntas frecuentes</p>
            <h1 className="mt-6 text-5xl font-black md:text-6xl">Respuestas rápidas para seguir avanzando</h1>

            <div className="mt-20 space-y-6">
              {esFaqs.map((faq) => (
                <div key={faq.question} className="rounded-xl bg-slate-900 p-8">
                  <h2 className="text-2xl font-black">{faq.question}</h2>
                  <p className="mt-4 leading-8 text-slate-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      }
    />
  );
}
