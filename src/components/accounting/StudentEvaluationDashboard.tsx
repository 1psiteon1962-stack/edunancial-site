export default function StudentEvaluationDashboard() {

  return (

    <section className="rounded-xl bg-slate-900 p-8">

      <h2 className="text-4xl font-black">
        Student Evaluations
      </h2>

      <div className="grid md:grid-cols-5 gap-6 mt-8">

        <div>Course</div>
        <div>Responses</div>
        <div>Average Rating</div>
        <div>Recommend %</div>
        <div>Instructor Score</div>

        <div>Content Quality</div>
        <div>Ease of Understanding</div>
        <div>Practical Value</div>
        <div>Suggestions</div>
        <div>Trend</div>

      </div>

    </section>

  );

}
