import Link from "next/link";

export default function VoiceBanner(){

return(

<section className="rounded-xl border p-8">

<h2 className="text-3xl font-bold">

Voice AI

</h2>

<Link href="/voice-assistant">

Talk Instead of Typing

</Link>

</section>

);

}
