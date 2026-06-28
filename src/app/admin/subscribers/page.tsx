export default function SubscribersPage(){

return(

<main className="min-h-screen bg-slate-950 text-white p-10">

<h1 className="text-5xl font-black">

Subscribers

</h1>

<div className="grid gap-4 mt-10">

<input

placeholder="Search"

className="rounded-lg bg-slate-900 p-4"

/>

<button

className="rounded-lg bg-green-600 p-4 font-bold"

>

Export CSV

</button>

<div className="rounded-xl bg-slate-900 p-8">

Subscriber database will appear here.

</div>

</div>

</main>

);

}
