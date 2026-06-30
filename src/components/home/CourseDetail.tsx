"use client";

export default function CourseDetail(){

return(

<section className="bg-[#101827] py-24">

<div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12">

<div className="aspect-video rounded-2xl bg-slate-800 flex items-center justify-center">

Course Video

</div>

<div>

<h1 className="text-5xl font-black">

Course Title

</h1>

<p className="mt-8 text-xl text-gray-300">

Complete course description.

</p>

<div className="grid gap-4 mt-10">

<div className="rounded-xl bg-slate-900 p-5">

Lessons

</div>

<div className="rounded-xl bg-slate-900 p-5">

Worksheets

</div>

<div className="rounded-xl bg-slate-900 p-5">

Certificate

</div>

<div className="rounded-xl bg-slate-900 p-5">

Progress Tracking

</div>

</div>

<div className="flex gap-4 mt-12">

<button className="rounded-xl bg-blue-600 px-8 py-4 font-bold">

Enroll

</button>

<button className="rounded-xl bg-green-600 px-8 py-4 font-bold">

Preview Lesson

</button>

</div>

</div>

</div>

</section>

);

}
