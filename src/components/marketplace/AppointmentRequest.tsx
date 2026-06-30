"use client";

export default function AppointmentRequest(){

return(

<section className="rounded-xl bg-slate-900 p-8">

<h2 className="text-3xl font-black">

Request Appointment

</h2>

<div className="grid gap-4 mt-8">

<input
className="rounded-lg bg-slate-800 p-4"
placeholder="Preferred Date"
/>

<input
className="rounded-lg bg-slate-800 p-4"
placeholder="Preferred Time"
/>

<textarea
className="rounded-lg bg-slate-800 p-4"
rows={6}
placeholder="Describe your needs"
/>

<button className="rounded-lg bg-blue-600 p-4 font-bold">

Submit Request

</button>

</div>

</section>

);

}
