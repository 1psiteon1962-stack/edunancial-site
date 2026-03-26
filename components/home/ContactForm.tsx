'use client';

import { submitForm } from '@/app/actions/submit';

export default function ContactForm() {
  return (
    <form action={submitForm} className="flex flex-col gap-4">
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        required
        className="border p-2"
      />

      <input
        type="email"
        name="email"
        placeholder="Your Email"
        required
        className="border p-2"
      />

      <textarea
        name="message"
        placeholder="Your Message"
        required
        className="border p-2"
      />

      <button type="submit" className="bg-black text-white p-2">
        Submit
      </button>
    </form>
  );
}
