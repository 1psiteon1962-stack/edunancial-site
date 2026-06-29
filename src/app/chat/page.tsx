export default function ChatPage(){

return(

<main className="min-h-screen bg-slate-100">

<div className="max-w-6xl mx-auto p-8">

<h1 className="text-5xl font-bold">

AI Chat Assistant

</h1>

<div className="bg-white rounded-xl shadow mt-8 p-6 h-[500px]">

Conversation Window

</div>

<input

className="w-full border rounded-lg p-4 mt-6"

placeholder="Type your question..."

/>

<button

className="mt-4 rounded-lg bg-blue-600 text-white px-6 py-3">

Send

</button>

</div>

</main>

);

}
