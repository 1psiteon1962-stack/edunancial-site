// components/forms/ContactForm.tsx
"use client";

export default function ContactForm() {
  return (
    <form action="/start" method="post" className="space-y-4">
      <input
        type="email"
        name="email"
        required
        placeholder="Enter your email"
        className="w-full border px-4 py-2"
      />
      <button
        type="submit"
        className="w-full bg-black text-white py-2"
      >
        Continue
      </button>
    </form>
  );
}
