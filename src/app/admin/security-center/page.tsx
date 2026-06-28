export default function SecurityCenter(){

const widgets=[

"Threat Monitor",

"Intrusion Detection",

"Audit Logs",

"Backups",

"Disaster Recovery",

"API Keys",

"Security Policies",

"File Integrity",

"Security Score",

"System Health"

];

return(

<main className="min-h-screen bg-slate-950 text-white p-10">

<h1 className="text-5xl font-black">

Enterprise Security Center

</h1>

<div className="grid gap-6 mt-10 lg:grid-cols-2">

{widgets.map(widget=>(

<div
key={widget}
className="rounded-xl bg-slate-900 p-6">

<h2 className="text-xl font-bold">

{widget}

</h2>

</div>

))}

</div>

</main>

);

}
