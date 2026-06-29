import Link from "next/link";

export default function FinancialCalculatorBanner(){

return(

<section className="rounded-xl bg-white shadow p-8">

<h2 className="text-3xl font-bold">

Financial Calculators

</h2>

<Link
href="/calculators"
className="inline-block mt-6 rounded-lg bg-blue-600 text-white px-5 py-3">

Open Calculators

</Link>

</section>

);

}
