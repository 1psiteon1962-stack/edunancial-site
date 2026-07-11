import InternationalPreferencesPanel from "@/components/international/InternationalPreferencesPanel";

export default function Settings(){

return(

<main className="min-h-screen bg-white">

<div className="max-w-6xl mx-auto p-10">

<h1 className="text-5xl font-bold">

Account Settings

</h1>

<div className="grid gap-6 mt-10">

<div className="rounded-xl border p-6">

Profile

</div>

<div className="rounded-xl border p-6">

Password & Security

</div>

<div className="rounded-xl border p-6">

Notifications

</div>

<InternationalPreferencesPanel />

<div className="rounded-xl border p-6">

Privacy

</div>

</div>

</div>

</main>

);

}
