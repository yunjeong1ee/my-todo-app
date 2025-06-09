'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import SignIn from '../../components/SignIn'

export default function SignInPage() {
  const [error, setError] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    const errorMessage = searchParams.get('error')
    if (errorMessage) {
      setError(errorMessage)
    }
  }, [searchParams])

  return (
    <>
      {error && (
        <div className="max-w-md mx-auto mt-4 p-4 bg-red-50 rounded-lg">
          <p className="text-sm text-center text-red-600">{error}</p>
        </div>
      )}
      <SignIn />
    </>
  )
} 