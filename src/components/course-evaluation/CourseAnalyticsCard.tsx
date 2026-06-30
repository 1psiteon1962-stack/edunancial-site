export default function CourseAnalyticsCard() {
  return (
    <div className="rounded-xl bg-slate-900 p-6">
      <h3 className="text-xl font-bold">
        Course Analytics
      </h3>

      <div className="mt-6 space-y-3">

        <p>Students Enrolled</p>

        <p>Students Completed</p>

        <p>Completion Rate</p>

        <p>Average Rating</p>

        <p>Recommendation Rate</p>

      </div>
    </div>
  );
}
