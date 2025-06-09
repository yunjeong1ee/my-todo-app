'use client'

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignIn() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const { signIn } = useAuth()

  const validateForm = () => {
    if (!email) {
      setMessage('이메일을 입력해주세요.')
      return false
    }
    if (!email.includes('@')) {
      setMessage('올바른 이메일 형식이 아닙니다.')
      return false
    }
    if (!password) {
      setMessage('비밀번호를 입력해주세요.')
      return false
    }
    if (password.length < 6) {
      setMessage('비밀번호는 최소 6자 이상이어야 합니다.')
      return false
    }
    return true
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setMessage('')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const { error } = await signIn({
        email,
        password,
      })

      if (error) {
        // Supabase 에러 메시지를 한글로 변환
        switch (error.message) {
          case 'Invalid login credentials':
            throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.')
          case 'Email not confirmed':
            throw new Error('이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.')
          default:
            throw new Error(error.message)
        }
      }

      // 로그인 성공
      router.push('/dashboard')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">로그인</h2>
        
        <form onSubmit={handleSignIn} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setMessage('')
                }}
                onBlur={() => {
                  if (email && !email.includes('@')) {
                    setMessage('올바른 이메일 형식이 아닙니다.')
                  }
                }}
                placeholder="이메일을 입력하세요"
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-lg"
                required
              />
            </div>

            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setMessage('')
                }}
                onBlur={() => {
                  if (password && password.length < 6) {
                    setMessage('비밀번호는 최소 6자 이상이어야 합니다.')
                  }
                }}
                placeholder="비밀번호를 입력하세요"
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-lg"
                required
              />
            </div>
          </div>

          {message && (
            <div className="text-sm text-center text-red-600 bg-red-50 p-3 rounded-lg">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="text-center">
          <Link 
            href="/signup"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            계정이 없으신가요? 회원가입하기
          </Link>
        </div>
      </div>
    </div>
  )
} 