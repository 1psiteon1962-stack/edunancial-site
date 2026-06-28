export default function NewsletterAdmin(){

return(

<main className="min-h-screen bg-slate-950 text-white p-10">

<h1 className="text-5xl font-black">

Newsletter Manager

</h1>

<div className="grid gap-5 mt-10">

<input

placeholder="Newsletter Title"

className="rounded-lg bg-slate-900 p-4"

/>

<input

placeholder="Subject"

className="rounded-lg bg-slate-900 p-4"

/>

<textarea

rows={10}

placeholder="Newsletter"

className="rounded-lg bg-slate-900 p-4"

/>

<input

type="datetime-local"

className="rounded-lg bg-slate-900 p-4"

/>

<button

className="rounded-lg bg-blue-600 p-4 font-bold"

>

Schedule Newsletter

</button>

</div>

</main>

);

}
