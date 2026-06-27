type Props = {
  title: string;
  filename: string;
};

export default function DownloadCard({
  title,
  filename,
}: Props) {
  return (
    <div className="rounded-2xl bg-[#151b2d] p-8 shadow-lg">

      <h2 className="text-2xl font-black">
        {title}
      </h2>

      <p className="mt-4 text-gray-400">
        {filename}
      </p>

      <button
        className="mt-8 rounded-xl bg-green-600 hover:bg-green-700 px-6 py-3 font-bold text-white"
      >
        Download
      </button>

    </div>
  );
}
