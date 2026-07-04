interface Props {

  status: string;

}

export default function CountryStatusBadge({

  status,

}: Props) {

  return (

    <span className="rounded-full bg-slate-200 px-3 py-1 text-sm font-semibold">

      {status}

    </span>

  );

}
