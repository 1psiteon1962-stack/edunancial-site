export default function QuizCard({

title,

questions,

passing

}:{

title:string;

questions:number;

passing:number;

}){

return(

<div className="rounded-xl bg-slate-900 p-6">

<h2 className="text-2xl font-bold">

{title}

</h2>

<p>

Questions: {questions}

</p>

<p>

Passing Score: {passing}%

</p>

</div>

);

}
