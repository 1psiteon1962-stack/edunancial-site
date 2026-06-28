export default function AdminBooksPage(){

return(

<main className="min-h-screen bg-[#08101f] text-white p-10">

<h1 className="text-6xl font-black">
Book Administration
</h1>

<div className="grid gap-6 mt-12">

<input
placeholder="Book Title"
className="rounded-xl bg-[#101a2f] p-4"
/>

<input
placeholder="Author"
className="rounded-xl bg-[#101a2f] p-4"
/>

<input
placeholder="Price"
className="rounded-xl bg-[#101a2f] p-4"
/>

<select
className="rounded-xl bg-[#101a2f] p-4"
>

<option>North America</option>

<option>Caribbean</option>

<option>Latin America</option>

<option>Europe</option>

<option>Africa</option>

<option>Middle East</option>

<option>Asia Pacific</option>

</select>

<button
className="rounded-xl bg-blue-600 p-4 font-bold"
>

Upload Book

</button>

</div>

</main>

);

}
