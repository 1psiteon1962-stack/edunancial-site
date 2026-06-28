export default function LeadCaptureAdmin(){

return(

<main className="min-h-screen bg-slate-950 text-white p-10">

<h1 className="text-5xl font-black">

Lead Capture

</h1>

<div className="grid gap-5 mt-10">

<input

placeholder="Lead Magnet Name"

className="rounded-lg bg-slate-900 p-4"

/>

<input

placeholder="Destination Email"

className="rounded-lg bg-slate-900 p-4"

/>

<input

type="file"

className="rounded-lg bg-slate-900 p-4"

/>

<button

className="rounded-lg bg-blue-600 p-4 font-bold"

>

Publish Lead Magnet

</button>

</div>

</main>

);

}
