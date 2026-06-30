export default function CourseLibrary() {

const courses=[

{
title:"RED Foundations",
level:"Beginner",
price:"Coming Soon"
},

{
title:"WHITE Foundations",
level:"Beginner",
price:"Coming Soon"
},

{
title:"BLUE Foundations",
level:"Beginner",
price:"Coming Soon"
},

{
title:"Business KPIs",
level:"Intermediate",
price:"Coming Soon"
},

{
title:"AI For Entrepreneurs",
level:"Advanced",
price:"Coming Soon"
},

{
title:"Economic Self Defense",
level:"All Levels",
price:"Coming Soon"
}

];

return(

<section className="bg-[#101827] py-24">

<div className="max-w-7xl mx-auto px-6">

<h2 className="text-5xl font-black">

Course Library

</h2>

<div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 mt-12">

{courses.map(course=>(

<div
key={course.title}
className="rounded-2xl border border-slate-700 bg-slate-900 p-8">

<div className="h-52 rounded-xl bg-slate-800 flex items-center justify-center">

Course Thumbnail

</div>

<h3 className="mt-6 text-2xl font-bold">

{course.title}

</h3>

<p className="mt-3 text-gray-400">

{course.level}

</p>

<p className="mt-4 font-semibold">

{course.price}

</p>

<button className="mt-8 rounded-xl bg-blue-600 px-6 py-3 font-bold hover:bg-blue-700">

View Course

</button>

</div>

))}

</div>

</div>

</section>

);

}
