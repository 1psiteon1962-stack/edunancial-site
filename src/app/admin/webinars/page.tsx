export default function WebinarAdmin(){

return(

<main className="min-h-screen bg-slate-950 text-white p-10">

<h1 className="text-5xl font-black">

Webinar Manager

</h1>

<div className="grid gap-5 mt-10">

<input
placeholder="Webinar Title"
className="rounded-lg bg-slate-900 p-4"
/>

<input
type="datetime-local"
className="rounded-lg bg-slate-900 p-4"
/>

<input
placeholder="Presenter"
className="rounded-lg bg-slate-900 p-4"
/>

<button
className="rounded-lg bg-blue-600 p-4 font-bold"
>

Publish Webinar

</button>

</div>

</main>

);

}
