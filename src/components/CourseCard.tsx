import Link from "next/link";

type Props = {
title: string;
description: string;
lessons: number;
href: string;
};

export default function CourseCard({
title,
description,
lessons,
href,
}: Props) {
return (
<div className="rounded-2xl bg-[#151b2d] p-8 shadow-lg">

  <h2 className="text-3xl font-bold">
    {title}
  </h2>

  <p className="mt-4 text-gray-300">
    {description}
  </p>

  <p className="mt-6 text-blue-400 font-semibold">
    {lessons} Lessons
  </p>

  <Link
    href={href}
    className="inline-block mt-8 rounded-xl bg-blue-600 px-6 py-3 font-bold text-white"
  >
    View Course
  </Link>

</div>

);
}
