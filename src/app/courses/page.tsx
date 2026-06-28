export default function CoursesPage() {

  return (

    <main className="min-h-screen bg-[#08101f] text-white px-6 py-20">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-6xl font-black">
          COURSES
        </h1>

        <p className="mt-6 text-gray-300 text-xl">

          Self-paced financial literacy courses
          designed for desktop, tablet and smartphone.

        </p>

        <div className="grid gap-8 mt-16 md:grid-cols-2">

          <CourseCard
            title="Red Course"
            description="Real Estate Wealth Building"
          />

          <CourseCard
            title="White Course"
            description="Paper Assets & Investing"
          />

          <CourseCard
            title="Blue Course"
            description="Business & Entrepreneurship"
          />

          <CourseCard
            title="Economic Self Defense"
            description="Putting It All Together"
          />

        </div>

      </div>

    </main>

  );

}

function CourseCard({
  title,
  description,
}:{
  title:string;
  description:string;
}){

return(

<div className="rounded-2xl bg-[#101a2f] border border-white/10 p-8">

<h2 className="text-3xl font-black">
{title}
</h2>

<p className="mt-5 text-gray-300">
{description}
</p>

<button className="mt-8 rounded-xl bg-blue-600 px-8 py-4 font-bold">
Coming Soon
</button>

</div>

);

}
