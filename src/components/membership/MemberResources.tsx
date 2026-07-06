export default function MemberResources() {

  const resources = [

    "Download Center",

    "Templates",

    "Worksheets",

    "Financial Forms",

    "Business Forms",

    "Checklists",

    "Reference Guides",

    "Videos",

  ];

  return (

    <section className="py-24">

      <div className="mx-auto max-w-7xl px-6">

        <h2 className="text-6xl font-black">

          Member Resource Library

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {resources.map((resource)=>(

            <div
              key={resource}
              className="rounded-xl bg-slate-900 p-8"
            >

              {resource}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
