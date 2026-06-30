export default function LessonAnalytics() {

const lessons=[
"Lesson 1",
"Lesson 2",
"Lesson 3",
"Lesson 4",
"Lesson 5",
"Lesson 6",
"Lesson 7",
"Lesson 8"
];

return(

<section className="rounded-xl bg-slate-900 p-8">

<h2 className="text-3xl font-black">

Lesson Analytics

</h2>

<div className="grid md:grid-cols-2 gap-6 mt-8">

{lessons.map((lesson)=>(

<div
key={lesson}
className="rounded-xl bg-slate-800 p-6">

<h3 className="text-xl font-bold">

{lesson}

</h3>

<p className="mt-2">

Students Started

</p>

<p>

Students Finished

</p>

<p>

Average Rating

</p>

</div>

))}

</div>

</section>

);

}
