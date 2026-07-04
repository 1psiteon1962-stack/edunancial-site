export default function CommunicationsCard() {

  return (

    <section className="rounded-2xl border border-blue-200 bg-blue-50 p-8 shadow-sm">

      <h2 className="text-2xl font-bold">

        Communications Center

      </h2>

      <p className="mt-4 text-slate-700">

        AI will monitor phone calls,
        emails, website chat,
        WhatsApp, SMS,
        and future communication channels.

      </p>

      <div className="mt-8 space-y-4">

        <Status
          title="Phone Calls"
        />

        <Status
          title="Website Chat"
        />

        <Status
          title="Email"
        />

        <Status
          title="SMS"
        />

      </div>

    </section>

  );

}

function Status({

  title,

}: {

  title: string;

}) {

  return (

    <div className="flex justify-between rounded-xl bg-white p-4">

      <span>{title}</span>

      <span className="font-semibold text-blue-700">

        Planned

      </span>

    </div>

  );

}
