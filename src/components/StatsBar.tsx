export default function StatsBar() {
return (
<section className="bg-black py-10">
<div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-center">

    <div>
      <h2 className="text-4xl font-black text-red-500">3</h2>
      <p className="text-gray-400">Learning Paths</p>
    </div>

    <div>
      <h2 className="text-4xl font-black text-white">1000+</h2>
      <p className="text-gray-400">Future Financial Terms</p>
    </div>

    <div>
      <h2 className="text-4xl font-black text-blue-500">Books</h2>
      <p className="text-gray-400">Digital Library</p>
    </div>

    <div>
      <h2 className="text-4xl font-black text-green-500">24/7</h2>
      <p className="text-gray-400">Online Learning</p>
    </div>

  </div>
</section>

);
}
