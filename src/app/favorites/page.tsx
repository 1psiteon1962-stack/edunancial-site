import Link from "next/link";

export default function FavoritesPage(){

return(

<main className="min-h-screen bg-[#08101f] text-white">

<div className="max-w-6xl mx-auto px-6 py-20">

<h1 className="text-5xl font-black">

Favorites

</h1>

<p className="mt-6 text-slate-300 text-xl">

Quick access to your favorite content.

</p>

<div className="mt-10 flex flex-wrap gap-4">

<Link
  href="/library/favorites"
  className="rounded-xl bg-blue-600 px-8 py-4 font-bold hover:bg-blue-500"
>
  Library Favorites
</Link>

</div>

</div>

</main>

);

}
