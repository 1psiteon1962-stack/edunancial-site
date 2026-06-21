"use client";

import { useState } from "react";

export default function CookieBanner(){

const [accepted,setAccepted]=

useState(false);

if(accepted){

return null;

}

return(

<div

style={{

position:"fixed",

bottom:0,

left:0,

right:0,

padding:"20px",

background:"#f5f5f5",

borderTop:"1px solid #ddd",

zIndex:1000,

}}

>

<p>

This website uses cookies

and analytics

to improve user experience.

</p>

<button

onClick={()=>

setAccepted(true)

}

>

Accept

</button>

</div>

);

}
