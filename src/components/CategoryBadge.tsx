type Props = {
title: string;
color: string;
};

export default function CategoryBadge({
title,
color,
}: Props) {
return (
<span
className="px-4 py-2 rounded-full text-sm font-bold text-white"
style={{ backgroundColor: color }}
>
{title}
</span>
);
}
