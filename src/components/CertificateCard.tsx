interface Props {
  course: string;
  completed: boolean;
}

export default function CertificateCard({
  course,
  completed,
}: Props) {
  return (
    <div className="rounded-2xl bg-[#151b2d] p-8">

      <h2 className="text-3xl font-black">
        {course}
      </h2>

      <p className="mt-6 text-gray-300">
        {completed
          ? "Certificate Available"
          : "Complete the course to unlock your certificate."}
      </p>

      <button
        disabled={!completed}
        className="mt-8 rounded-xl bg-blue-600 disabled:bg-gray-700 px-6 py-3 font-bold"
      >
        Download Certificate
      </button>

    </div>
  );
}
