import Image from "next/image";
import Link from "next/link";

export default function VideoLessonCard({
title,
description,
href,
thumbnail
}:{
title:string;
description:string;
href:string;
thumbnail:string;
}){

return(

<Link
href={href}
className="block rounded-xl overflow-hidden border border-slate-700 bg-slate-900 hover:border-blue-500"
>

<Image
src={thumbnail}
alt={title}
width={1280}
height={720}
unoptimized
className="aspect-video w-full object-cover"
/>

<div className="p-5">

<h2 className="text-2xl font-bold">

{title}

</h2>

<p className="mt-2 text-slate-400">

{description}

</p>

</div>

</Link>

);

}
