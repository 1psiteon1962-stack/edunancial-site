import SquareBuyButton from "./SquareBuyButton";

type Props = {
color: string;
title: string;
terms: number;
price: string;
checkoutUrl: string;
};

export default function PackCard({
color,
title,
terms,
price,
checkoutUrl,
}: Props) {
return (
<div
className="rounded-2xl p-8 shadow-xl"
style={{
border: "2px solid ${color}",
background: "#151b2d",
}}
>
<h2
className="text-3xl font-bold"
style={{ color }}
>
{title}
</h2>

  <p className="mt-4 text-gray-300">
    {terms} Financial Terms
  </p>

  <div className="flex justify-between items-center mt-10">

    <span className="text-3xl font-black">
      {price}
    </span>

    <SquareBuyButton
      checkoutUrl={checkoutUrl}
      label="Unlock"
    />

  </div>

</div>

);
}
