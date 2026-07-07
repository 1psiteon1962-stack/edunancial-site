const reasons = [

"Personal Dashboard",

"AI Guidance",

"Learning Paths",

"Competency Tracking",

"Decision Labs",

"Business Tools",

"Certificates",

"Case Studies",

];

export default function WhyBecomeMember(){

return(

<section className="py-20">

<h2 className="text-5xl font-black">

Membership Includes

</h2>

<div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

{reasons.map(reason=>(

<div
key={reason}
className="rounded-xl bg-slate-900 p-6"
>

{reason}

</div>

))}

</div>

</section>

);

}
