export default function MembershipPage() {

return(

<main className="min-h-screen bg-[#08101f] text-white px-6 py-20">

<div className="max-w-6xl mx-auto">

<h1 className="text-6xl font-black">
MEMBERSHIP
</h1>

<p className="mt-6 text-xl text-gray-300">

Become an Edunancial member and receive
exclusive books,
courses,
downloads,
financial calculators,
and future member benefits.

</p>

<div className="grid gap-8 mt-16 md:grid-cols-3">

<div className="rounded-2xl bg-[#101a2f] p-8">

<h2 className="text-3xl font-black">
Basic
</h2>

<p className="mt-5">
$9.99/month
</p>

</div>

<div className="rounded-2xl bg-blue-700 p-8">

<h2 className="text-3xl font-black">
Gold
</h2>

<p className="mt-5">
$29.99/month
</p>

</div>

<div className="rounded-2xl bg-[#101a2f] p-8">

<h2 className="text-3xl font-black">
Lifetime
</h2>

<p className="mt-5">
Coming Soon
</p>

</div>

</div>

</div>

</main>

);

}
