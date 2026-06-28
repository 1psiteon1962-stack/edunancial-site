import YouTubePlayer from "@/components/YouTubePlayer";

export default function LessonPage(){

return(

<main className="min-h-screen bg-slate-950 text-white p-10">

<h1 className="text-5xl font-black">

Course Lesson

</h1>

<div className="mt-10">

<YouTubePlayer

title="Lesson"

url="https://youtu.be/"

 />

</div>

<div className="mt-10 rounded-xl bg-slate-900 p-8">

<h2 className="text-3xl font-bold">

Lesson Notes

</h2>

<p className="mt-4">

Downloads, quizzes, assignments, transcripts and discussion boards appear here.

</p>

</div>

</main>

);

}
