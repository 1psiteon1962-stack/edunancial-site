type Props = {
  title: string;
  body: string;
};

export default function RegionSection({ title, body }: Props) {
  return (
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-3">
        {title}
      </h2>
      <p className="text-gray-700 leading-relaxed">
        {body}
      </p>
    </section>
  );
}
