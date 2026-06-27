"use client";

import SquareBuyButton from "./SquareBuyButton";

type Props = {

title: string;

description: string;

price: string;

checkoutUrl: string;

};

export default function SquareCheckoutCard({

title,

description,

price,

checkoutUrl,

}: Props) {

return (

<div className="rounded-2xl bg-[#151b2d] p-8 shadow-xl">

<h2 className="text-3xl font-black">

{title}

</h2>

<p className="mt-5 text-gray-300">

{description}

</p>

<div className="flex justify-between items-center mt-10">

<span className="text-4xl font-black">

{price}

</span>

<SquareBuyButton
checkoutUrl={checkoutUrl}
label="Purchase"
/>

</div>

</div>

);

}
