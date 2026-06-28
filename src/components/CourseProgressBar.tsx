export default function CourseProgressBar({
progress
}:{progress:number}){

return(

<div className="w-full rounded-full bg-slate-800 h-3">

<div

className="bg-blue-600 h-3 rounded-full"

style={{
width:`${progress}%`
}}

 />

</div>

);

}
