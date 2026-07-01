export default function CountryConfigurationPanel() {
  return (
    <section className="rounded-xl bg-slate-900 p-8">
      <h2 className="text-3xl font-black text-white">
        Country Configuration
      </h2>

      <div className="mt-8 grid gap-6 md:grid-cols-2">

        <label>
          <p className="mb-2 text-slate-300">Country</p>
          <select className="w-full rounded bg-slate-800 p-3 text-white">
            <option>Uganda</option>
            <option>United States</option>
            <option>Canada</option>
            <option>Dominican Republic</option>
            <option>Spain</option>
          </select>
        </label>

        <label>
          <p className="mb-2 text-slate-300">Primary Language</p>
          <select className="w-full rounded bg-slate-800 p-3 text-white">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>Swahili</option>
          </select>
        </label>

      </div>
    </section>
  );
}
