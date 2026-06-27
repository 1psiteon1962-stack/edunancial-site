type Props = {
title: string;
description: string;
color: string;
};

export default function FeatureCard({
title,
description,
color,
}: Props) {
return (
<div
className="rounded-2xl p-8 bg-[#111827] border"
style={{ borderColor: color }}
>
<h2
className="text-2xl font-bold"
style={{ color }}
>
{title}
</h2>

  <p className="mt-4 text-gray-300 leading-7">
    {description}
  </p>
</div>

);
}
