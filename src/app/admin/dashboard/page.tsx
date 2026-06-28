export default function DashboardPage() {

  const cards = [
    ["Global Revenue", "$0.00"],
    ["Net Profit", "$0.00"],
    ["Profit Margin", "0%"],
    ["Members", "0"],
    ["Books Sold", "0"],
    ["Courses Sold", "0"],
    ["Countries", "0"],
    ["Regions", "0"],
  ];

  return (
    <main className="min-h-screen bg-[#08101f] text-white p-10">

      <h1 className="text-6xl font-black">
        Executive Dashboard
      </h1>

      <div className="grid gap-6 mt-16 md:grid-cols-2 lg:grid-cols-4">

        {cards.map(([title,value])=>(

          <div
            key={title}
            className="rounded-2xl border border-white/10 bg-[#101a2f] p-8"
          >

            <p className="text-gray-400">
              {title}
            </p>

            <h2 className="mt-4 text-4xl font-black">
              {value}
            </h2>

          </div>

        ))}

      </div>

    </main>
  );

}
