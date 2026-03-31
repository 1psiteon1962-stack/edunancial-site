'use client'

import { ReactNode } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  requiredLevel: number
  children: ReactNode
}

export default function AccessGate({ requiredLevel, children }: Props) {
  const router = useRouter()

  // TEMP USER LEVEL (replace later)
  const userLevel = 0

  if (userLevel < requiredLevel) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Access Restricted</h2>
        <p>You need a higher plan to access this content.</p>
        <button
          onClick={() => router.push('/login')}
          style={{ marginTop: '20px', padding: '10px 20px' }}
        >
          Go to Login
        </button>
      </div>
    )
  }

  return <>{children}</>
}
