'use client'

import { useEffect, useState } from 'react'

type Slide = {
  title: string
  description: string
}

const slides: Slide[] = [
  {
    title: 'Build Wealth',
    description: 'Learn how to build real wealth step by step.',
  },
  {
    title: 'Start a Business',
    description: 'Create structured, scalable businesses.',
  },
  {
    title: 'Think Global',
    description: 'Expand beyond borders and scale internationally.',
  },
]

export default function HeroSlider() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const slide = slides[index]

  return (
    <div className="w-full h-[300px] flex items-center justify-center bg-gray-100 text-center p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{slide.title}</h2>
        <p className="text-gray-600">{slide.description}</p>
      </div>
    </div>
  )
}
