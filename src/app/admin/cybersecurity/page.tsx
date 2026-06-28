export default function CyberSecurityDashboard(){

const panels=[

"Encryption",

"Secrets",

"Malware Scanner",

"Secure Uploads",

"Vulnerabilities",

"Incidents",

"Security Headers",

"Threat Intelligence",

"Security Metrics",

"Compliance"

];

return(

<main className="min-h-screen bg-slate-950 text-white p-10">

<h1 className="text-5xl font-black">

Cybersecurity Command Center

</h1>

<div className="grid gap-6 mt-10 lg:grid-cols-2">

{panels.map(panel=>(

<div
key={panel}
className="rounded-xl bg-slate-900 p-6">

<h2 className="text-xl font-bold">

{panel}

</h2>

</div>

))}

</div>

</main>

);

}
