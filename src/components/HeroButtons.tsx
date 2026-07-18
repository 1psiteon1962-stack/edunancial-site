"use client";

import Link from "next/link";

export default function HeroButtons() {

return (

<div className="flex flex-wrap justify-center gap-5 mt-12">

  <Link
    href="/marketplace"
    className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl font-bold"
  >
    Marketplace
  </Link>

  <Link
    href="/courses"
    className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-bold"
  >
    Courses
  </Link>

  <Link
    href="/terms"
    className="bg-white text-black hover:bg-gray-200 px-8 py-4 rounded-xl font-bold"
  >
    Financial Terms
  </Link>

  <Link
    href="/membership"
    className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-xl font-bold"
  >
    Membership
  </Link>

</div>

);

}
