export default function FooterSection() {
  return (
    <footer className="w-full bg-black text-white py-10 px-6 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Edunancial</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            A financial education company empowering new generations through
            accessible, bilingual wealth-building resources.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>Books</li>
            <li>Courses</li>
            <li>Apps</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Global Expansion</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Edunancial mirror sites serve Africa, Latin America, Asia, and
            Europe — with region-specific language, pricing, and AI learning
            models.
          </p>
        </div>
      </div>

      <div className="text-center text-gray-400 text-xs pt-8">
        © {new Date().getFullYear()} Edunancial, Inc. All rights reserved.
      </div>
    </footer>
  );
}
