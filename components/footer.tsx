export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white py-10 px-6 mt-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        
        <div>
          <h3 className="text-xl font-semibold mb-3">Edunancial</h3>
          <p className="text-gray-300">
            A bilingual financial education company empowering new generations through
            wealth-building resources.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Resources</h3>
          <ul className="space-y-2 text-gray-300">
            <li>Books</li>
            <li>Courses</li>
            <li>Apps</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-gray-300">
            <li>About Us</li>
            <li>Blog</li>
            <li>Contact</li>
          </ul>
        </div>

      </div>

      <p className="text-center text-gray-400 text-sm mt-10">
        © {new Date().getFullYear()} Edunancial, Inc. All rights reserved.
      </p>
    </footer>
  );
}
