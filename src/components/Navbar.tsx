import Link from "next/link";

export default function Navbar() {

return (

<nav
style={{

display:"flex",

justifyContent:"space-between",

alignItems:"center",

padding:"20px",

borderBottom:"1px solid #ddd",

background:"#ffffff",

}}

>

<div>

<Link

href="/"

style={

{

fontWeight:"bold",

fontSize:"28px",

textDecoration:"none",

color:"#000",

}

}

>

Edunancial

</Link>

</div>

<div

style={

{

display:"flex",

gap:"20px",

}

}

>

<Link href="/about">About</Link>

<Link href="/courses">Courses</Link>

<Link href="/membership">Membership</Link>

<Link href="/levels">Levels</Link>

<Link href="/sponsor">Sponsor</Link>

<Link href="/contact">Contact</Link>

</div>

</nav>

);

}
