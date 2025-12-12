"use client";

export default function FooterSection() {
  return (
    <footer className="w-full bg-black text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-3">Edunancial</h3>
          <p className="text-sm">
            A financial education company empowering new generations through
            accessible, bilingual wealth-building resources.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li>Books</li>
            <li>Courses</li>
            <li>Apps</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Global Vision</h4>
          <p className="text-sm">
            Built in the U.S. — expanding across Latin America, Africa,
            Europe, and Asia.
          </p>
        </div>
      </div>
    </footer>
  );
}
