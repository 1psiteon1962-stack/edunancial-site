"use client";

export default function CourseAdmin() {

return(

<section className="bg-[#08101f] py-24">

<div className="max-w-6xl mx-auto px-6">

<h2 className="text-5xl font-black">

Course Administration

</h2>

<div className="grid gap-6 mt-12">

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Course Title"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Instructor"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Category (RED / WHITE / BLUE)"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Price"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Thumbnail URL"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Video URL"/>

<input className="rounded-xl bg-slate-900 border border-slate-700 p-5" placeholder="Workbook PDF"/>

<textarea className="rounded-xl bg-slate-900 border border-slate-700 p-5 min-h-40" placeholder="Course Description"/>

<button className="rounded-xl bg-blue-600 py-4 text-xl font-bold hover:bg-blue-700">

Save Course

</button>

</div>

</div>

</section>

);

}
