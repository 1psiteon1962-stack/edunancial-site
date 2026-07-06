export default function MeetYourAITeam() {

  const team = [

    "CEO",

    "CFO",

    "Treasury",

    "Operations",

    "Marketing",

    "Sales",

    "Risk",

    "Family Office",

  ];

  return (

    <section className="bg-[#08101f] py-24">

      <div className="mx-auto max-w-7xl px-6">

        <p className="font-bold uppercase tracking-[0.45em] text-yellow-400">

          EXECUTIVE AI TEAM

        </p>

        <h2 className="mt-6 text-6xl font-black">

          Meet Your AI Advisors

        </h2>

        <div className="mt-20 grid gap-8 md:grid-cols-4">

          {team.map((member)=>(

            <div
              key={member}
              className="rounded-xl bg-slate-900 p-8"
            >

              AI {member}

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}
