import Link from "next/link";

export default function CapitalCenter(){

return(

<section className="rounded-xl bg-white shadow p-8">

<h2 className="text-3xl font-bold">

Capital Center

</h2>

<p className="mt-4">

Prepare your business before seeking outside capital.

</p>

<Link
href="/funding-center"
className="inline-block mt-6 rounded-lg bg-green-600 px-5 py-3 text-white">

Prepare Now

</Link>

</section>

);

}
