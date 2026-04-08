import React from 'react'

/**
 * Define section types
 */
type Section =
  | { type: 'hero'; title?: string; description?: string }
  | { type: 'features'; items?: string[] }
  | { type: 'pricing' }
  | { type: 'testimonial'; quote?: string; author?: string }

/**
 * HERO
 */
function HeroSection({ title, description }: { title?: string; description?: string }) {
  return (
    <section className="p-10 bg-gray-100 text-center">
      <h1 className="text-3xl font-bold">{title || 'Welcome to Edunancial'}</h1>
      <p className="mt-4 text-gray-600">
        {description || 'Build systems. Scale globally. Think bigger.'}
      </p>
    </section>
  )
}

/**
 * FEATURES
 */
function FeaturesSection({ items }: { items?: string[] }) {
  return (
    <section className="p-10">
      <ul className="space-y-2">
        {(items || ['Feature 1', 'Feature 2', 'Feature 3']).map((item, i) => (
          <li key={i} className="border p-3 rounded">
            {item}
          </li>
        ))}
      </ul>
    </section>
  )
}

/**
 * PRICING
 */
function PricingSection() {
  return (
    <section className="p-10 bg-gray-50 text-center">
      <h2 className="text-2xl font-bold">Pricing</h2>
      <p className="mt-2 text-gray-600">Simple and scalable plans.</p>
    </section>
  )
}

/**
 * TESTIMONIAL
 */
function TestimonialSection({ quote, author }: { quote?: string; author?: string }) {
  return (
    <section className="p-10 text-center">
      <blockquote className="italic text-lg">
        "{quote || 'This platform changed how I think about business.'}"
      </blockquote>
      <p className="mt-2 text-gray-500">- {author || 'User'}</p>
    </section>
  )
}

/**
 * MAIN RENDERER
 */
export default function SectionRenderer({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section, index) => {
        switch (section.type) {
          case 'hero':
            return <HeroSection key={index} {...section} />

          case 'features':
            return <FeaturesSection key={index} {...section} />

          case 'pricing':
            return <PricingSection key={index} />

          case 'testimonial':
            return <TestimonialSection key={index} {...section} />

          default:
            return null
        }
      })}
    </>
  )
}
