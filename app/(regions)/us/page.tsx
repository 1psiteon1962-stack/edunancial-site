export default function USHome() {
  return (
    <main className="min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-4">Edunancial — United States</h1>
      <p className="mb-6 text-lg">
        This platform adapts to where you are in your business journey — not the other way around.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <a href="/us/l1" className="border p-6 rounded-xl hover:bg-gray-100">
          <h2 className="text-2xl font-bold">I am just starting</h2>
          <p>I need clarity, income, and direction.</p>
        </a>

        <a href="/us/l2" className="border p-6 rounded-xl hover:bg-gray-100">
          <h2 className="text-2xl font-bold">I am self-employed</h2>
          <p>I need systems, tax strategy, and stability.</p>
        </a>

        <a href="/us/l3" className="border p-6 rounded-xl hover:bg-gray-100">
          <h2 className="text-2xl font-bold">I own a business</h2>
          <p>I need protection, growth, and financing.</p>
        </a>

        <a href="/us/l4" className="border p-6 rounded-xl hover:bg-gray-100">
          <h2 className="text-2xl font-bold">I am scaling</h2>
          <p>I need teams, automation, and capital.</p>
        </a>

        <a href="/us/l5" className="border p-6 rounded-xl hover:bg-gray-100 col-span-full">
          <h2 className="text-2xl font-bold">I build wealth systems</h2>
          <p>I operate holdings, capital stacks, and exits.</p>
        </a>

      </div>
    </main>
  )
}
