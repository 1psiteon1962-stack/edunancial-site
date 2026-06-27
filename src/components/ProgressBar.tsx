interface Props {
  current: number;
  total: number;
}

export default function ProgressBar({
  current,
  total,
}: Props) {
  const percent =
    total === 0 ? 0 : (current / total) * 100;

  return (
    <div className="w-full">
      <div className="h-3 rounded-full bg-gray-700">
        <div
          className="h-3 rounded-full bg-blue-600"
          style={{
            width: `${percent}%`,
          }}
        />
      </div>

      <p className="mt-3 text-sm text-gray-400">
        {current} of {total} completed
      </p>
    </div>
  );
}
