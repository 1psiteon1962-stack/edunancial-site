export default function VideoLessonsAdmin(){

return(

<main className="min-h-screen bg-slate-950 text-white p-10">

<h1 className="text-5xl font-black">

Video Lesson Manager

</h1>

<div className="grid gap-5 mt-10">

<input
placeholder="Lesson Title"
className="rounded-lg bg-slate-900 p-4"
/>

<textarea
rows={5}
placeholder="Lesson Description"
className="rounded-lg bg-slate-900 p-4"
/>

<input
placeholder="YouTube URL"
className="rounded-lg bg-slate-900 p-4"
/>

<input
type="file"
className="rounded-lg bg-slate-900 p-4"
/>

<input
type="datetime-local"
className="rounded-lg bg-slate-900 p-4"
/>

<button
className="rounded-lg bg-blue-600 p-4 font-bold"
>

Save Lesson

</button>

</div>

</main>

);

}
