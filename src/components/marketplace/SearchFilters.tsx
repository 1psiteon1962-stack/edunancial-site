export default function SearchFilters() {

  return (

    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="grid gap-4 md:grid-cols-5">

        <input
          className="rounded-xl border border-slate-300 px-4 py-3"
          placeholder="Search"
        />

        <select className="rounded-xl border border-slate-300 px-4 py-3">

          <option>Category</option>

        </select>

        <select className="rounded-xl border border-slate-300 px-4 py-3">

          <option>Country</option>

        </select>

        <select className="rounded-xl border border-slate-300 px-4 py-3">

          <option>State / Province</option>

        </select>

        <select className="rounded-xl border border-slate-300 px-4 py-3">

          <option>City</option>

        </select>

      </div>

    </section>

  );

}
