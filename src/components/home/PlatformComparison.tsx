export default function PlatformComparison() {

  const rows = [

    ["Traditional Courses","Memorize Information"],

    ["Edunancial","Develop Judgment"],

    ["Traditional Courses","Theory"],

    ["Edunancial","Real Businesses"],

    ["Traditional Courses","Hypothetical Examples"],

    ["Edunancial","Actual Case Studies"],

    ["Traditional Courses","Completion"],

    ["Edunancial","Competency"],

    ["Traditional Courses","Certificates"],

    ["Edunancial","Demonstrated Ability"],

  ];

  return (

    <section className="bg-[#08101f] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">

          WHY EDUNANCIAL?

        </p>

        <h2 className="mt-6 text-6xl font-black">

          A Different Way To Learn

        </h2>

        <div className="mt-16 space-y-4">

          {rows.map((row)=>(

            <div
              key={row[0]+row[1]}
              className="grid grid-cols-2 rounded-xl bg-slate-900 p-6"
            >

              <div>{row[0]}</div>

              <div className="font-bold text-green-400">

                {row[1]}

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
