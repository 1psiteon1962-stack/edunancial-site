export default function AIPage(){

return(

<main className="min-h-screen bg-white">

<div className="max-w-5xl mx-auto p-10">

<h1 className="text-5xl font-bold">

Edunancial AI Assistant

</h1>

<textarea

className="border rounded-lg w-full mt-10 p-4"

rows={8}

placeholder="Ask a financial literacy question..."

/>

<button

className="mt-6 rounded bg-blue-600 text-white px-6 py-3">

Ask AI

</button>

</div>

</main>

);

}
