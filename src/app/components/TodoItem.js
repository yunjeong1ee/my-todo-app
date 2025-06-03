"use client";

export default function TodoItem({ todo, onToggle, isCompleted }) {
  return (
    <li className="flex items-center gap-2 p-2 border rounded bg-gray-50">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="h-4 w-4"
      />
      <span className={`text-gray-500 ${isCompleted ? "line-through" : ""}`}>
        {todo.text}
      </span>
    </li>
  );
}
