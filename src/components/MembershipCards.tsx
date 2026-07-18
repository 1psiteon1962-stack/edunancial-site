export default function MembershipCards(){

return(

<section

style={

{

padding:"60px",

maxWidth:"1000px",

margin:"0 auto",

display:"grid",

gridTemplateColumns:

"repeat(auto-fit,minmax(250px,1fr))",

gap:"20px",

}

}

>

<div

style={

{

border:"1px solid #ddd",

padding:"25px",

borderRadius:"12px",

}

}

>

<h2>

Basic

</h2>

<p>

$24.99

Monthly

</p>

<ul>

<li>

Articles

</li>

<li>

Courses

</li>

<li>

Calculators

</li>

</ul>

</div>

<div

style={

{

border:"1px solid #ddd",

padding:"25px",

borderRadius:"12px",

}

}

>

<h2>

Gold

</h2>

<p>

$59.99

Monthly

</p>

<ul>

<li>

Everything in Basic

</li>

<li>

Advanced Courses

</li>

<li>

Trackers

</li>

<li>

Downloads

</li>

</ul>

</div>

<div

style={

{

border:"1px solid #ddd",

padding:"25px",

borderRadius:"12px",

}

}

>

<h2>

Mentor

</h2>

<p>

Future Program

</p>

<ul>

<li>

Mentorship

</li>

<li>

Entrepreneur Profiles

</li>

<li>

Sponsorship

</li>

</ul>

</div>

</section>

);

}
