"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { COGNITO_LOGIN_URL, COGNITO_LOGOUT_URL } from "@/services/auth";

// ✅ JWT 토큰 디코딩 함수
const decodeToken = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
  } catch (error) {
    return null;
  }
};

export default function Header() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSessionExpired, setShowSessionExpired] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const idToken = sessionStorage.getItem("idToken");
      if (!idToken) {
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);

      // ✅ 토큰 디코딩하여 exp(만료 시간) 추출
      const decodedToken = decodeToken(idToken);
      if (!decodedToken || !decodedToken.exp) {
        sessionStorage.clear();
        setIsAuthenticated(false);
        setShowSessionExpired(true);
        return;
      }

      // ✅ 현재 시간과 exp 비교하여 남은 시간 계산
      const currentTime = Math.floor(Date.now() / 1000);
      const expiresIn = decodedToken.exp - currentTime; // 남은 시간 (초 단위)

      if (expiresIn > 0) {
        console.log(`🔔 세션 만료까지 남은 시간: ${expiresIn}초`);

        // ✅ 만료 시간에 맞춰 자동 로그아웃 실행
        setTimeout(() => {
          sessionStorage.clear();
          setIsAuthenticated(false);
          setShowSessionExpired(true);
        }, expiresIn * 1000);
      } else {
        sessionStorage.clear();
        setIsAuthenticated(false);
        setShowSessionExpired(true);
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // ✅ 팝업 확인 버튼 클릭 시 로그인 페이지 이동
  const handleSessionExpired = () => {
    setShowSessionExpired(false);
    window.location.href = COGNITO_LOGIN_URL;
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
    setTimeout(() => {
      window.location.href = COGNITO_LOGOUT_URL;
    }, 100);
  };

  return (
    <header className="fixed top-0 w-full flex justify-between items-center p-4 bg-gray-800 text-white shadow-md">
      <Link href="/home">
        <h1 className="text-xl font-bold cursor-pointer">MOMO</h1>
      </Link>
      <nav className="flex gap-4">
        {!isAuthenticated ? (
          <Button
            text="로그인 / 회원가입"
            onClick={() => (window.location.href = COGNITO_LOGIN_URL)}
            className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          />
        ) : (
          <Button
            text="로그아웃"
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md"
          />
        )}
      </nav>

      {/* ✅ 세션 만료 팝업 */}
      {showSessionExpired && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold">세션이 만료되었습니다.</p>
            <p className="text-gray-600 mt-2">로그인 해주세요.</p>
            <button
              onClick={handleSessionExpired}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
