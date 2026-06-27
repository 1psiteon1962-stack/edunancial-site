"use client";

import { useState } from "react";

export default function BookSearch() {

  const [search, setSearch] = useState("");

  return (

    <div className="my-12">

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search books..."
        className="w-full rounded-2xl bg-[#151b2d] p-5 text-xl outline-none border border-gray-700 focus:border-blue-500"
      />

    </div>

  );

}
