"use client";

export default function ProfessionalFilters(){

return(

<div className="rounded-xl bg-slate-900 p-8">

<h2 className="text-3xl font-black">

Search Filters

</h2>

<div className="grid md:grid-cols-4 gap-4 mt-8">

<input

placeholder="Country"

className="rounded-lg bg-slate-800 p-4"

/>

<input

placeholder="State / Province"

className="rounded-lg bg-slate-800 p-4"

/>

<input

placeholder="City"

className="rounded-lg bg-slate-800 p-4"

/>

<input

placeholder="Profession"

className="rounded-lg bg-slate-800 p-4"

/>

</div>

</div>

);

}
