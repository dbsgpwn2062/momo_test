"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { getTokenFromCookies, clearSession } from "@/services/auth";
import { COGNITO_LOGIN_URL } from "@/services/auth";

export default function Header() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  // ✅ 로그인 상태 확인 및 토큰 만료 체크
  const checkAuthStatus = async () => {
    const idToken = await getTokenFromCookies();
    console.log("🔍 현재 idToken:", idToken); // ✅ 디버깅용 로그

    if (!idToken) {
      console.warn("❌ 인증되지 않은 사용자");
      setIsAuthenticated(false);
      return;
    }

    try {
      const decodedToken: { exp?: number } = jwtDecode(idToken);
      console.log("📅 디코딩된 토큰:", decodedToken);

      if (!decodedToken.exp) {
        console.error("토큰에 exp 필드가 없습니다.");
        clearSession();
        setIsAuthenticated(false);
        setShowLoginPopup(true);
        return;
      }

      const expTime = decodedToken.exp * 1000;
      const currentTime = Date.now();

      console.log("⏳ 토큰 만료 시간:", expTime);
      console.log("⌛ 현재 시간:", currentTime);

      if (currentTime >= expTime) {
        console.warn("🚨 토큰 만료됨. 자동 로그아웃 처리.");
        clearSession();
        setIsAuthenticated(false);
        setShowLoginPopup(true);
      } else {
        setIsAuthenticated(true);

        // ✅ 남은 시간 후 자동 로그아웃 처리
        setTimeout(() => {
          console.warn("🔄 토큰 만료 시간 도달. 자동 로그아웃.");
          clearSession();
          setIsAuthenticated(false);
          setShowLoginPopup(true);
        }, expTime - currentTime);
      }
    } catch (error) {
      console.error("❌ 토큰 디코딩 실패:", error);
      clearSession();
      setIsAuthenticated(false);
      setShowLoginPopup(true);
    }
  };

  // ✅ 로그인 상태 감지 (로그인/로그아웃될 때마다 실행)
  useEffect(() => {
    checkAuthStatus();
  }, []); // ✅ 처음 페이지 로드될 때 실행

  // ✅ 로그인 함수
  const handleLogin = () => {
    window.location.href = COGNITO_LOGIN_URL;
  };

  // ✅ 로그아웃 함수
  const handleLogout = () => {
    clearSession();
    setIsAuthenticated(false);
    router.push("/home");
  };

  return (
    <header className="fixed top-0 w-full flex justify-between items-center p-4 bg-gray-800 text-white shadow-md">
      <Link href="/home">
        <h1 className="text-xl font-bold cursor-pointer">MOMO</h1>
      </Link>
      <nav className="flex gap-4">
        {!isAuthenticated ? (
          <Button
            text="로그인"
            onClick={handleLogin}
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

      {/* ✅ 로그인 만료 팝업 */}
      {showLoginPopup && (
        <div className="popup">
          <p>로그인 세션이 만료되었습니다. 다시 로그인해주세요.</p>
          <button onClick={handleLogin}>로그인</button>
        </div>
      )}
    </header>
  );
}
