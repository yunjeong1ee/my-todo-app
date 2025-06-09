'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function TodoList() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const { user, signOut } = useAuth()

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTodos(data || [])
    } catch (error) {
      console.error('할 일 목록을 가져오는데 실패했습니다:', error.message)
    }
  }

  const addTodo = async (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ 
          title: newTodo,
          user_id: user.id 
        }])
        .select()

      if (error) throw error
      
      setTodos([...todos, ...data])
      setNewTodo('')
    } catch (error) {
      console.error('할 일을 추가하는데 실패했습니다:', error.message)
    }
  }

  const toggleTodo = async (id, isComplete) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ is_complete: !isComplete })
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
      
      fetchTodos()
    } catch (error) {
      console.error('할 일 상태를 변경하는데 실패했습니다:', error.message)
    }
  }

  const deleteTodo = async (id) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error
      
      setTodos(todos.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('할 일을 삭제하는데 실패했습니다:', error.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {user.email}
        </span>
        <button
          onClick={signOut}
          className="text-sm text-red-500 hover:text-red-700"
        >
          로그아웃
        </button>
      </div>

      <form onSubmit={addTodo} className="space-y-3">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="새로운 할 일을 입력하세요"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          추가
        </button>
      </form>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li 
            key={todo.id}
            className="flex items-center justify-between p-3 bg-white rounded-md shadow-sm"
          >
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={todo.is_complete}
                onChange={() => toggleTodo(todo.id, todo.is_complete)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className={todo.is_complete ? 'line-through text-gray-500' : ''}>
                {todo.title}
              </span>
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
} 