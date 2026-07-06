import Link from "next/link";

export default function NextLessonCard() {

  return (

    <div className="rounded-2xl bg-slate-900 p-10">

      <p className="font-bold uppercase tracking-[0.35em] text-yellow-400">

        NEXT LESSON

      </p>

      <h2 className="mt-6 text-4xl font-black">

        Know Your Numbers

      </h2>

      <p className="mt-6 text-slate-300">

        Learn why successful entrepreneurs make decisions
        using measurable facts instead of assumptions.

      </p>

      <div className="mt-10">

        <Link

          href="/courses"

          className="rounded-xl bg-blue-600 px-6 py-3 font-bold"

        >

          Resume Learning

        </Link>

      </div>

    </div>

  );

}
