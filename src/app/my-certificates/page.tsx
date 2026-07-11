import Link from "next/link";
import { getDemoPassport } from "@/lib/competency/demo-data";
import CertificateGallery from "@/components/passport/CertificateGallery";

export const metadata = {
  title: "My Certificates | Edunancial",
  description: "Download and share your earned financial competency certificates.",
};

export default function MyCertificates() {
  const passport = getDemoPassport();

  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-5xl px-6 py-20">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">
          CERTIFICATES
        </p>

        <h1 className="mt-6 text-5xl font-black">
          My Certificates
        </h1>

        <p className="mt-6 text-lg text-slate-300">
          Each certificate is tied to your Member Competency Passport and can be
          downloaded or shared with employers, partners, and your network.
        </p>

        <div className="mt-12">
          <CertificateGallery certificates={passport.certificates} />
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/passport"
            className="rounded-xl bg-blue-600 px-8 py-4 font-bold hover:bg-blue-700"
          >
            View Full Passport
          </Link>
          <Link
            href="/courses"
            className="rounded-xl border border-white/20 px-8 py-4 font-bold hover:bg-white/10"
          >
            Explore Courses
          </Link>
        </div>

      </section>
    </main>
  );
}

