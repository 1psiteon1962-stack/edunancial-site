import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getPublicProfile,
  learnerProfile,
  passportCertificates,
  skillsTranscript,
} from "@/lib/passport/passport-data";

interface PassportSharePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PassportSharePage({
  params,
}: PassportSharePageProps) {
  const { slug } = await params;
  const profile = getPublicProfile(slug);

  if (!profile) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
        <p className="font-bold uppercase tracking-[0.4em] text-cyan-300">
          Shareable profile
        </p>
        <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
          {profile.displayName}
        </h1>
        <p className="mt-4 text-xl text-slate-300">{profile.title}</p>
        <p className="mt-2 text-sm uppercase tracking-[0.25em] text-slate-400">
          {profile.location}
        </p>
        <p className="mt-8 max-w-4xl text-lg leading-8 text-slate-300">
          {profile.summary}
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={`/passport/verify?record=${learnerProfile.passportId}`}
            className="rounded-xl bg-emerald-600 px-6 py-4 font-semibold transition hover:bg-emerald-500"
          >
            Verify passport
          </Link>
          <Link
            href="/passport"
            className="rounded-xl border border-slate-700 px-6 py-4 font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-900"
          >
            View full passport
          </Link>
        </div>

        <section className="mt-12 rounded-3xl border border-slate-800 bg-slate-950/80 p-8">
          <h2 className="text-2xl font-black">Public highlights</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {profile.publicAchievements.map((achievement) => (
              <li
                key={achievement}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 text-slate-200"
              >
                {achievement}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
            <h2 className="text-2xl font-black">Visible transcript areas</h2>
            <div className="mt-6 space-y-4">
              {skillsTranscript.map((entry) => (
                <article
                  key={entry.category}
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-semibold text-white">{entry.category}</h3>
                    <p className="font-bold text-cyan-300">{entry.score}%</p>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">{entry.proficiency}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-950/80 p-8">
            <h2 className="text-2xl font-black">Visible credentials</h2>
            <div className="mt-6 space-y-4">
              {passportCertificates.map((certificate) => (
                <article
                  key={certificate.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5"
                >
                  <h3 className="font-semibold text-white">{certificate.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Credential ID: {certificate.credentialId}
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    Status: {certificate.status}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-12 rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
          <h2 className="text-2xl font-black">Privacy notice</h2>
          <p className="mt-4 text-slate-300">{profile.privacyNotice}</p>
        </section>
      </section>
    </main>
  );
}
