"use client";

export default function RotatingVideoSection() {
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Learn Visually — Learn Faster
        </h2>

        <p className="text-gray-600 max-w-3xl mx-auto mb-10">
          Our rotating short-form videos teach complex financial concepts in
          simple, clear, bilingual formats—perfect for busy entrepreneurs and
          students.
        </p>

        <div className="w-full flex justify-center">
          <div className="w-full max-w-3xl aspect-video bg-black rounded-lg shadow-lg flex items-center justify-center">
            <span className="text-white text-xl">Video Placeholder</span>
          </div>
        </div>
      </div>
    </section>
  );
}
