type Props = {

name:string;

country:string;

business:string;

goal:string;

};

export default function EntrepreneurCard({

name,

country,

business,

goal,

}:Props){

return(

<div

style={

{

border:"1px solid #ddd",

padding:"25px",

borderRadius:"12px",

background:"#fff",

marginBottom:"20px",

}

}

>

<h3>

{name}

</h3>

<p>

<strong>Country:</strong>

{country}

</p>

<p>

<strong>Business:</strong>

{business}

</p>

<p>

<strong>Goal:</strong>

{goal}

</p>

</div>

);

}
