"use client";

import { useState } from "react";

export default function SearchBar() {
const [search, setSearch] = useState("");

return (
<div className="max-w-3xl mx-auto">

  <input
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    type="text"
    placeholder="Search Financial Terms..."
    className="w-full rounded-xl border border-gray-700 bg-[#151b2d] px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
  />

</div>

);
}
