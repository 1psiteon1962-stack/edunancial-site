export default function RegionalPermissions() {
  const roles = [
    "Global Administrator",
    "Regional Director",
    "Country Administrator",
    "Instructor",
    "Support",
    "Marketing",
  ];

  return (
    <section className="rounded-xl bg-slate-900 p-8">
      <h2 className="text-3xl font-black text-white">
        Regional Permissions
      </h2>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {roles.map((role) => (
          <div
            key={role}
            className="rounded-lg bg-slate-800 p-5"
          >
            <h3 className="font-bold text-white">{role}</h3>
            <p className="mt-2 text-slate-400">
              Configure access levels and administrative privileges.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
