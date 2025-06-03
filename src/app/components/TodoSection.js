"use client";
import TodoItem from "./TodoItem";

export default function TodoSection({ title, todos, onToggle, isCompleted }) {
  if (todos.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl text-gray-600 font-bold mb-2">{title}</h2>
      <ul className="space-y-2">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            isCompleted={isCompleted}
          />
        ))}
      </ul>
    </div>
  );
}
