'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [status, setStatus] = useState<string | null>(null)

  async function submitForm(formData: FormData): Promise<void> {
    'use server'

    try {
      // Example: extract fields
      const name = formData.get('name')?.toString() || ''
      const email = formData.get('email')?.toString() || ''
      const message = formData.get('message')?.toString() || ''

      // TODO: replace with your real backend logic (email, Airtable, etc.)
      console.log('Contact form submission:', { name, email, message })

      // DO NOT return anything (must be void)
      // Handle success internally if needed

    } catch (error) {
      console.error('Contact form error:', error)
      // Throwing is valid in server actions if you want failure behavior
      throw new Error('Form submission failed')
    }
  }

  return (
    <form action={submitForm} className="flex flex-col gap-4 max-w-md">
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        required
        className="border p-2 rounded"
      />

      <input
        type="email"
        name="email"
        placeholder="Your Email"
        required
        className="border p-2 rounded"
      />

      <textarea
        name="message"
        placeholder="Your Message"
        required
        className="border p-2 rounded"
      />

      <button
        type="submit"
        className="bg-black text-white p-2 rounded"
      >
        Send Message
      </button>

      {status && <p>{status}</p>}
    </form>
  )
}
