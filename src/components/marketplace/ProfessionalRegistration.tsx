"use client";

export default function ProfessionalRegistration() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white p-10">

      <h1 className="text-5xl font-black">
        Join Edunancial Marketplace
      </h1>

      <p className="mt-4 text-gray-400">
        Connect with students, entrepreneurs, investors, and businesses worldwide.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mt-10">

        <input className="rounded-lg bg-slate-900 p-4" placeholder="Full Name" />

        <input className="rounded-lg bg-slate-900 p-4" placeholder="Business Name" />

        <input className="rounded-lg bg-slate-900 p-4" placeholder="Email" />

        <input className="rounded-lg bg-slate-900 p-4" placeholder="Phone Number" />

        <input className="rounded-lg bg-slate-900 p-4" placeholder="Website" />

        <input className="rounded-lg bg-slate-900 p-4" placeholder="Country" />

      </div>

    </main>
  );
}
