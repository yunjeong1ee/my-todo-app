'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState('처리중')
  const [error, setError] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Current URL:', window.location.href)
        
        // Supabase 자동 세션 처리 대기
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          throw sessionError
        }

        if (!session) {
          // 세션이 없는 경우 수동으로 처리 시도
          const { error: signInError } = await supabase.auth.signInWithOAuth({
            provider: 'email',
            options: {
              skipBrowserRedirect: true
            }
          })

          if (signInError) {
            console.error('Sign in error:', signInError)
            throw signInError
          }
        }

        setStatus('성공')
        // 3초 후 로그인 페이지로 자동 이동
        setTimeout(() => {
          router.push('/signin')
        }, 3000)
      } catch (error) {
        console.error('Authentication error:', error)
        setStatus('실패')
        setError(error.message || '인증 처리 중 오류가 발생했습니다.')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md text-center">
        {status === '처리중' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              이메일 인증 처리 중...
            </h2>
            <p className="text-gray-600 mb-4">
              잠시만 기다려주세요. 인증이 완료되면 자동으로 이동됩니다.
            </p>
          </>
        )}

        {status === '성공' && (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                이메일 인증 완료!
              </h2>
              <p className="text-gray-600 mb-2">
                회원가입이 성공적으로 완료되었습니다.
              </p>
              <p className="text-sm text-gray-500">
                3초 후 자동으로 로그인 페이지로 이동합니다...
              </p>
            </div>
          </>
        )}

        {status === '실패' && (
          <>
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                인증 실패
              </h2>
              <p className="text-red-600 mb-6">
                {error}
              </p>
              <div className="space-y-4">
                <button
                  onClick={() => router.push('/signup')}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  회원가입 다시 시도하기
                </button>
                <button
                  onClick={() => router.push('/signin')}
                  className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  로그인 페이지로 이동
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 