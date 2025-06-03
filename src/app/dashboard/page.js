import Navigation from "../components/Navigation";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-sm mx-auto px-4">
        <Navigation />
        <h1 className="text-3xl font-bold text-gray-700 text-center mb-8">
          대시보드
        </h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            여기에 대시보드 내용이 들어갈 예정입니다.
          </p>
        </div>
      </div>
    </main>
  );
}
