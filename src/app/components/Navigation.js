"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="grid grid-cols-2 gap-2 mb-8 w-full">
      <Link
        href="/"
        className={`px-4 py-2 rounded-md text-center ${
          pathname === "/"
            ? "bg-gray-100 text-gray-700"
            : "text-gray-700 hover:bg-gray-50"
        }`}
      >
        홈
      </Link>
      <Link
        href="/dashboard"
        className={`px-4 py-2 rounded-md text-center ${
          pathname === "/dashboard"
            ? "bg-gray-100 text-gray-700"
            : "text-gray-700 hover:bg-gray-50"
        }`}
      >
        대시보드
      </Link>
    </nav>
  );
}
