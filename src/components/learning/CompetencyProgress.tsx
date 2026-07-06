export default function CompetencyProgress() {

  const competencies = [

    ["Financial Literacy",100],

    ["Financial Competency",72],

    ["Entrepreneurship",41],

    ["Business Operations",18],

    ["Business Scaling",0],

    ["Executive Leadership",0],

  ];

  return (

    <section className="bg-[#111827] py-24">

      <div className="mx-auto max-w-6xl px-6">

        <h2 className="text-5xl font-black">

          Competency Progress

        </h2>

        <div className="mt-16 space-y-8">

          {competencies.map(([title,percent])=>(

            <div key={title}>

              <div className="mb-2 flex justify-between">

                <span>{title}</span>

                <span>{percent}%</span>

              </div>

              <div className="h-4 rounded-full bg-slate-700">

                <div

                  className="h-4 rounded-full bg-green-500"

                  style={{width:`${percent}%`}}

                />

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
