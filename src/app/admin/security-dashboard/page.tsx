export default function SecurityDashboard(){

return(

<main className="min-h-screen bg-slate-950 text-white p-10">

<h1 className="text-5xl font-black">

Security Operations Center

</h1>

<div className="grid gap-6 mt-10 lg:grid-cols-4">

<div className="rounded-xl bg-slate-900 p-6">Threat Level</div>

<div className="rounded-xl bg-slate-900 p-6">Failed Logins</div>

<div className="rounded-xl bg-slate-900 p-6">Blocked IPs</div>

<div className="rounded-xl bg-slate-900 p-6">System Health</div>

<div className="rounded-xl bg-slate-900 p-6">Database</div>

<div className="rounded-xl bg-slate-900 p-6">Backups</div>

<div className="rounded-xl bg-slate-900 p-6">API Status</div>

<div className="rounded-xl bg-slate-900 p-6">Executive Alerts</div>

</div>

</main>

);

}
