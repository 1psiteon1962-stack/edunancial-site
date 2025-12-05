export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white py-10 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Column 1 */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Edunancial</h3>
          <p className="text-gray-300">
            Bilingual financial education designed to empower new generations.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Navigation</h3>
          <ul className="space-y-2 text-gray-300">
            <li><a href="/books">Books</a></li>
            <li><a href="/courses">Courses</a></li>
            <li><a href="/apps">Apps</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-gray-300">
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Use</a></li>
          </ul>
        </div>
      </div>

      <div className="text-center text-gray-400 mt-10">
        © {new Date().getFullYear()} Edunancial, Inc. All rights reserved.
      </div>
    </footer>
  );
}
