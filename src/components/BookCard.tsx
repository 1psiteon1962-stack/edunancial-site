import Image from "next/image";
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

  <Image
    src={image}
    alt={title}
    width={960}
    height={640}
    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
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
