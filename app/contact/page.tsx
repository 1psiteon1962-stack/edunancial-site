// app/contact/page.tsx
import ContactForm from "@/components/forms/ContactForm";

export default function ContactPage() {
  return (
    <main className="max-w-xl mx-auto py-16">
      <h1 className="text-3xl font-bold mb-6">
        Start Your Financial Track
      </h1>
      <p className="mb-8">
        Enter your email to continue. No spam. No sales pitches.
      </p>
      <ContactForm />
    </main>
  );
}
