import CourseProgressBar
from "@/components/CourseProgressBar";

export default function MyCourses(){

return(

<main className="min-h-screen bg-slate-950 text-white p-10">

<h1 className="text-5xl font-black">

My Courses

</h1>

<div className="mt-10 rounded-xl bg-slate-900 p-8">

<h2 className="text-3xl font-bold">

Financial Literacy

</h2>

<CourseProgressBar
progress={0}
/>

<p className="mt-4">

Resume where you left off.

</p>

</div>

</main>

);

}
