import Link from "next/link";

export default function CallToAction(){

return(

<section

style={

{

padding:"80px",

textAlign:"center",

background:"#f5f5f5",

}

}

>

<h2>

Ready To Start?

</h2>

<p>

Improve your financial literacy.

Build wealth.

Help others create opportunity.

</p>

<div

style={

{

marginTop:"30px",

display:"flex",

justifyContent:"center",

gap:"20px",

}

}

>

<Link href="/membership">

Membership

</Link>

<Link href="/courses">

Courses

</Link>

<Link href="/sponsor">

Sponsor

</Link>

</div>

</section>

);

}
