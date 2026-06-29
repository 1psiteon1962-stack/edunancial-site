import Link from "next/link";

export default function FinancialTools(){

return(

<main className="min-h-screen bg-white">

<div className="max-w-7xl mx-auto p-10">

<h1 className="text-5xl font-black">

Financial Tools

</h1>

<div className="grid lg:grid-cols-4 gap-6 mt-10">

<Link href="/calculators">ROI Calculator</Link>

<Link href="/calculators">LTV Calculator</Link>

<Link href="/calculators">CAC Calculator</Link>

<Link href="/calculators">Break-Even Calculator</Link>

</div>

</div>

</main>

);

}
