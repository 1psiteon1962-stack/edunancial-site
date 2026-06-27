import Link from "next/link";

export default function HomepageMembership() {
  return (
    <section className="bg-[#050816] text-white py-24 px-6">

      <div className="max-w-6xl mx-auto text-center">

        <p className="uppercase tracking-[0.18em] text-[#C49A28] font-bold">
          Membership
        </p>

        <h2 className="text-5xl md:text-7xl font-black mt-6">
          One Membership.
          <br />
          Unlimited Learning.
        </h2>

        <p className="mt-10 text-xl text-gray-300 max-w-3xl mx-auto">
          Books. Financial Terms. Courses. Downloads.
          One account gives you access to the growing
          Edunancial ecosystem.
        </p>

        <Link
          href="/membership"
          className="inline-block mt-14 bg-blue-600 hover:bg-blue-700 rounded-xl px-10 py-4 font-bold"
        >
          Become a Member
        </Link>

      </div>

    </section>
  );
}
