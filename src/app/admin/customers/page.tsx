export default function CustomerAdministrationPage() {

  const stats = [

    {
      title: "Total Customers",
      value: "0"
    },

    {
      title: "Active Members",
      value: "0"
    },

    {
      title: "Monthly Subscribers",
      value: "0"
    },

    {
      title: "Lifetime Customers",
      value: "0"
    }

  ];

  return (

    <main className="min-h-screen bg-[#08101f] text-white p-10">

      <h1 className="text-6xl font-black">

        Customer Administration

      </h1>

      <p className="mt-6 text-xl text-gray-300">

        Search, manage and monitor all Edunancial customers worldwide.

      </p>

      <div className="grid gap-6 mt-12 lg:grid-cols-4">

        {stats.map((item)=>(

          <div
            key={item.title}
            className="rounded-2xl bg-[#101a2f] border border-white/10 p-8"
          >

            <p className="text-gray-400">

              {item.title}

            </p>

            <h2 className="text-4xl font-black mt-3">

              {item.value}

            </h2>

          </div>

        ))}

      </div>

      <div className="rounded-2xl bg-[#101a2f] border border-white/10 p-8 mt-12">

        <input
          placeholder="Search customer..."
          className="w-full rounded-xl bg-[#08101f] p-4"
        />

      </div>

    </main>

  );

}
