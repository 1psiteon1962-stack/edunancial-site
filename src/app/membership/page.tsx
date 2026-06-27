export default function MembershipPage() {
  return (
    <main className="min-h-screen bg-[#0a0f1e] text-white">

      <section className="max-w-5xl mx-auto px-6 py-20">

        <h1 className="text-5xl font-black">
          Edunancial Membership
        </h1>

        <p className="mt-5 text-xl text-gray-300">
          One membership. Unlimited financial education.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-16">

          <div className="bg-[#151b2d] rounded-2xl p-8">

            <h2 className="text-2xl font-bold">
              Monthly
            </h2>

            <div className="text-5xl font-black mt-6">
              $19
            </div>

            <ul className="mt-8 space-y-3 text-gray-300">
              <li>✔ All eBooks</li>
              <li>✔ Financial Terms App</li>
              <li>✔ Future Courses</li>
              <li>✔ Updates Included</li>
            </ul>

            <button className="mt-10 w-full rounded-xl bg-blue-600 py-4 font-bold">
              Subscribe
            </button>

          </div>

        </div>

      </section>

    </main>
  );
}
