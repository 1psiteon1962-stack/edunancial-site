import Link from "next/link";

export default function Footer(){

return(

<footer

style={

{

marginTop:"60px",

padding:"40px",

background:"#f5f5f5",

textAlign:"center",

}

}

>

<h3>

Edunancial

</h3>

<p>

Financial Literacy For Real Life

</p>

<p>

We provide educational information only.

We do not provide financial,

investment,

legal,

tax,

or accounting advice.

</p>

<div

style={

{

display:"flex",

justifyContent:"center",

gap:"20px",

flexWrap:"wrap",

marginTop:"20px",

}

}

>

<Link href="/privacy">

Privacy

</Link>

<Link href="/terms">

Terms

</Link>

<Link href="/disclaimer">

Disclaimer

</Link>

<Link href="/refund-policy">

Refund Policy

</Link>

<Link href="/faq">

FAQ

</Link>

</div>

<p

style={

{

marginTop:"30px",

fontSize:"14px",

}

}

>

© 2026 Edunancial.

All Rights Reserved.

</p>

</footer>

);

}
