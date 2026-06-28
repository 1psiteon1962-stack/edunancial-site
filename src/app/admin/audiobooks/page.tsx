export default function AudioBookManager(){

return(

<main className="min-h-screen bg-[#08101f] text-white p-10">

<h1 className="text-6xl font-black">

Audio Book Manager

</h1>

<div
className="grid gap-6 mt-12"
>

<input
placeholder="Audio Book Title"
className="rounded-xl bg-[#101a2f] p-4"
/>

<input
type="file"
className="rounded-xl bg-[#101a2f] p-4"
/>

<button
className="rounded-xl bg-blue-600 p-4 font-bold"
>

Publish Audio Book

</button>

</div>

</main>

);

}
