'use client';

import Link from 'next/link';

type Props = {
  region: string;
};

export default function CurriculumPath({ region }: Props) {
  return (
    <section className="mt-10 space-y-6">
      <h2 className="text-2xl font-semibold">
        Start your learning path
      </h2>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <li>
          <Link href={`/courses?region=${region}`}>
            <div className="border p-4 rounded hover:bg-gray-50">
              Foundations of Capital & Risk
            </div>
          </Link>
        </li>

        <li>
          <Link href={`/readiness?region=${region}`}>
            <div className="border p-4 rounded hover:bg-gray-50">
              Readiness & Discipline Assessment
            </div>
          </Link>
        </li>

        <li>
          <Link href={`/membership`}>
            <div className="border p-4 rounded hover:bg-gray-50">
              Membership Access
            </div>
          </Link>
        </li>
      </ul>
    </section>
  );
}
