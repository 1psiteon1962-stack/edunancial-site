import SquareBuyButton from "./SquareBuyButton";

type Props = {
title: string;
description: string;
price: string;
image: string;
checkoutUrl: string;
};

export default function BookCard({
title,
description,
price,
image,
checkoutUrl,
}: Props) {
return (
<div className="rounded-2xl bg-[#151b2d] overflow-hidden shadow-xl">

  <img
    src={image}
    alt={title}
    className="w-full h-72 object-cover"
  />

  <div className="p-6">

    <h2 className="text-3xl font-bold">
      {title}
    </h2>

    <p className="mt-4 text-gray-300">
      {description}
    </p>

    <div className="flex justify-between items-center mt-8">

      <span className="text-3xl font-black">
        {price}
      </span>

      <SquareBuyButton checkoutUrl={checkoutUrl} />

    </div>

  </div>

</div>

);
}
