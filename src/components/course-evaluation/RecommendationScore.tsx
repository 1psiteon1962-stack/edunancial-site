export default function RecommendationScore() {
  return (
    <div className="rounded-xl bg-slate-900 p-6">
      <h2 className="text-xl font-bold">
        Recommendation Score
      </h2>

      <div className="mt-6 space-y-2">
        <p>Definitely Recommend</p>
        <p>Probably Recommend</p>
        <p>Neutral</p>
        <p>Probably Would Not</p>
        <p>Definitely Would Not</p>
      </div>
    </div>
  );
}
