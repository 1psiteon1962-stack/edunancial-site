"use client";

import Link from "next/link";

export default function MobileBottomNav(){

return(

<nav className="fixed bottom-0 left-0 right-0 bg-white border-t lg:hidden">

<div className="grid grid-cols-5 text-center py-3">

<Link href="/">🏠</Link>

<Link href="/courses">📚</Link>

<Link href="/ai">🤖</Link>

<Link href="/marketplace">💼</Link>

<Link href="/dashboard">👤</Link>

</div>

</nav>

);

}
