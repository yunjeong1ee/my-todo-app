"use client";
import { useState } from "react";
import FloatingButton from "./FloatingButton";
import AddTodoModal from "./AddTodoModal";
import TodoSection from "./TodoSection";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
    setNewTodo("");
    setIsModalOpen(false);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <div className="max-w-2xl mx-auto p-4 relative min-h-[400px]">
      {todos.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p className="text-lg">할 일을 추가해보세요!</p>
          <p className="text-sm mt-2">오른쪽 하단의 + 버튼을 클릭하세요</p>
        </div>
      ) : (
        <div className="space-y-4">
          <TodoSection
            title="진행중인 할 일"
            todos={activeTodos}
            onToggle={toggleTodo}
            isCompleted={false}
          />
          <TodoSection
            title="완료된 할 일"
            todos={completedTodos}
            onToggle={toggleTodo}
            isCompleted={true}
          />
        </div>
      )}

      {/* Floating Add Button */}
      <FloatingButton onClick={() => setIsModalOpen(true)} />

      <AddTodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addTodo}
        newTodo={newTodo}
        onNewTodoChange={setNewTodo}
      />
    </div>
  );
}
