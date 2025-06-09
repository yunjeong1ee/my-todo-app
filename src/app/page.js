'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'
import Auth from "../components/Auth"
import TodoList from "../components/TodoList"

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/signin')
    }
  }, [user, router])

  return null
}
