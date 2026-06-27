"use client";

import Link from "next/link";

export default function CallToAction() {
return (
<section className="bg-[#0b1020] py-24">
<div className="max-w-6xl mx-auto text-center px-6">
<h2 className="text-5xl font-black text-white">
Start Building Wealth Today
</h2>

    <p className="text-xl text-gray-300 mt-6">
      Learn. Apply. Build. Repeat.
    </p>

    <Link
      href="/membership"
      className="inline-block mt-10 rounded-xl bg-blue-600 px-10 py-4 font-bold text-white hover:bg-blue-700"
    >
      Become a Member
    </Link>
  </div>
</section>

);
}
