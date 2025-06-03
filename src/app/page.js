import Image from "next/image";
import TodoList from "./components/TodoList";
import Navigation from "./components/Navigation";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-sm mx-auto px-4">
        <Navigation />
        <h1 className="text-3xl font-bold text-gray-700 text-center mb-8">
          Todo App
        </h1>
        <TodoList />
      </div>
    </main>
  );
}
