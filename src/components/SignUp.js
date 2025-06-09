'use client'

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function SignUp() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('error') // 'error' or 'success'
  const router = useRouter()
  const { signUp } = useAuth()

  const validateForm = () => {
    if (!email) {
      setMessage('이메일을 입력해주세요.')
      setMessageType('error')
      return false
    }
    if (!email.includes('@')) {
      setMessage('올바른 이메일 형식이 아닙니다.')
      setMessageType('error')
      return false
    }
    if (!password) {
      setMessage('비밀번호를 입력해주세요.')
      setMessageType('error')
      return false
    }
    if (password.length < 6) {
      setMessage('비밀번호는 최소 6자 이상이어야 합니다.')
      setMessageType('error')
      return false
    }
    return true
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setMessage('')
    setMessageType('error')

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const { error } = await signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            type: 'signup'
          }
        }
      })

      if (error) {
        // Supabase 에러 메시지를 한글로 변환
        switch (error.message) {
          case 'User already registered':
            throw new Error('이미 등록된 이메일 주소입니다.')
          case 'Password should be at least 6 characters':
            throw new Error('비밀번호는 최소 6자 이상이어야 합니다.')
          case 'Unable to validate email address: invalid format':
            throw new Error('올바른 이메일 형식이 아닙니다.')
          default:
            throw error
        }
      }

      // 회원가입 성공
      setMessage('가입 확인 이메일을 발송했습니다. 이메일을 확인해주세요! (스팸함도 확인해주세요)')
      setMessageType('success')
      setEmail('')
      setPassword('')
    } catch (error) {
      console.error('회원가입 에러:', error)
      setMessage(error.message)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  // 개발 환경에서만 사용할 사용자 삭제 함수
  const handleDeleteUser = async () => {
    if (!email) {
      setMessage('삭제할 이메일 주소를 입력해주세요.')
      setMessageType('error')
      return
    }

    try {
      setLoading(true)
      
      // 먼저 해당 이메일의 사용자 정보를 조회
      const { data: users, error: fetchError } = await supabase.auth.admin.listUsers()
      
      if (fetchError) throw fetchError

      const userToDelete = users?.find(user => user.email === email)
      
      if (!userToDelete) {
        setMessage('해당 이메일의 사용자를 찾을 수 없습니다.')
        setMessageType('error')
        return
      }

      // 사용자 삭제
      const { error: deleteError } = await supabase.auth.admin.deleteUser(
        userToDelete.id
      )

      if (deleteError) throw deleteError

      setMessage('사용자가 성공적으로 삭제되었습니다. 다시 가입할 수 있습니다.')
      setMessageType('success')
      setEmail('')
      setPassword('')
    } catch (error) {
      setMessage(error.message)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">회원가입</h2>
        
        <form onSubmit={handleSignUp} className="mt-8 space-y-6">
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
                    setMessageType('error')
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
                    setMessageType('error')
                  }
                }}
                placeholder="비밀번호를 입력하세요"
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 text-lg"
                required
              />
            </div>
          </div>

          {message && (
            <div className={`text-sm text-center p-3 rounded-lg ${
              messageType === 'error' 
                ? 'text-red-600 bg-red-50' 
                : 'text-green-600 bg-green-50'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? '처리중...' : '회원가입'}
          </button>
        </form>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-2">개발 테스트용 도구</p>
            <button
              type="button"
              onClick={handleDeleteUser}
              className="w-full py-2 px-4 border border-red-300 text-red-600 rounded-md text-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? '처리중...' : '테스트를 위해 현재 이메일 사용자 삭제'}
            </button>
            <p className="text-xs text-gray-400 mt-1">
              * 이 버튼은 개발 환경에서만 표시됩니다
            </p>
          </div>
        )}

        <div className="text-center">
          <Link 
            href="/signin"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            이미 계정이 있으신가요? 로그인하기
          </Link>
        </div>
      </div>
    </div>
  )
} 