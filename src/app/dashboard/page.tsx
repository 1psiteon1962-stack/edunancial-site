import Link from "next/link";

export const metadata = {
  title: "Student Dashboard | Edunancial",
};

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">

      <section className="mx-auto max-w-7xl px-6 py-24">

        <p className="uppercase tracking-[0.45em] font-bold text-yellow-400">
          STUDENT DASHBOARD
        </p>

        <h1 className="mt-6 text-6xl font-black">
          Welcome Back
        </h1>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          <div className="rounded-xl bg-red-700 p-8">
            <h2 className="text-4xl font-black">12</h2>
            <p className="mt-3">Courses Completed</p>
          </div>

          <div className="rounded-xl bg-blue-700 p-8">
            <h2 className="text-4xl font-black">8</h2>
            <p className="mt-3">Books Read</p>
          </div>

          <div className="rounded-xl bg-green-700 p-8">
            <h2 className="text-4xl font-black">14</h2>
            <p className="mt-3">Badges Earned</p>
          </div>

          <div className="rounded-xl bg-yellow-500 p-8 text-black">
            <h2 className="text-4xl font-black">87%</h2>
            <p className="mt-3">Competency Score</p>
          </div>

        </div>

        <div className="mt-20 flex flex-wrap gap-6">

          <Link href="/courses" className="rounded-lg bg-blue-600 px-8 py-4 font-bold">
            Continue Learning
          </Link>

          <Link href="/passport" className="rounded-lg bg-green-600 px-8 py-4 font-bold">
            View Passport
          </Link>

        </div>

      </section>

    </main>
  );
}
