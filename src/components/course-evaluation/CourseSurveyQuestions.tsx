export default function CourseSurveyQuestions() {
  return (
    <div className="rounded-xl bg-slate-900 p-6">
      <h2 className="text-2xl font-bold mb-6">
        Evaluation Questions
      </h2>

      <ul className="space-y-3 text-slate-300">
        <li>Overall Course Quality</li>
        <li>Content Accuracy</li>
        <li>Instructor Effectiveness</li>
        <li>Ease of Understanding</li>
        <li>Practical Value</li>
        <li>Would You Recommend This Course?</li>
        <li>Would You Purchase Another Course?</li>
        <li>Most Valuable Lesson</li>
        <li>Least Valuable Lesson</li>
        <li>Suggestions for Improvement</li>
      </ul>
    </div>
  );
}
