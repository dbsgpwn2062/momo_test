"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const idToken = sessionStorage.getItem("idToken");
    setIsAuthenticated(!!idToken);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("idToken");
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("userInfo");

    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <Link href="/main">
        <h1 className="text-xl font-bold cursor-pointer">MOMO</h1>
      </Link>
      <nav>
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            로그아웃
          </button>
        ) : (
          <Link href="/login">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              로그인
            </button>
          </Link>
        )}
      </nav>
    </header>
  );
}
