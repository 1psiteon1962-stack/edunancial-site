'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  requiredLevel: number
  children: ReactNode
}

export default function AccessGate({ requiredLevel, children }: Props) {
  const router = useRouter()

  // TEMP: replace with real auth later
  const userLevel = 0

  if (userLevel < requiredLevel) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Access Restricted</h2>
        <p>You need a higher plan to access this page.</p>
        <button
          onClick={() => router.push('/login')}
          style={{
            marginTop: '1rem',
            padding: '10px 20px',
            cursor: 'pointer'
          }}
        >
          Go to Login
        </button>
      </div>
    )
  }

  return <>{children}</>
}
