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
    console.log("🔍 현재 idToken:", idToken);

    if (!idToken) {
      console.warn("❌ 인증되지 않은 사용자");
      setIsAuthenticated(false);
      return;
    }

    try {
      const decodedToken: { exp?: number; iat?: number } = jwtDecode(idToken);
      console.log("📅 디코딩된 토큰:", decodedToken);

      if (!decodedToken.exp) {
        console.error("❌ 토큰에 exp 필드가 없음");
        await clearSession();
        setIsAuthenticated(false);
        setShowLoginPopup(true);
        return;
      }

      const expTime = decodedToken.exp * 1000;
      const currentTime = Date.now();

      console.log("⏳ 토큰 만료 시간 (exp):", new Date(expTime));
      console.log("⌛ 현재 시간:", new Date(currentTime));

      if (currentTime >= expTime) {
        console.warn("🚨 토큰 만료됨. 자동 로그아웃 처리.");
        await clearSession();
        setIsAuthenticated(false);
        setShowLoginPopup(true);
      } else {
        console.log("✅ 토큰이 유효함.");
        setIsAuthenticated(true);

        // ✅ 남은 시간 후 자동 로그아웃 및 팝업 표시
        setTimeout(async () => {
          console.warn("🔄 토큰 만료 시간 도달. 자동 로그아웃.");
          await clearSession();
          setIsAuthenticated(false);
          setShowLoginPopup(true);
        }, expTime - currentTime);
      }
    } catch (error) {
      console.error("❌ 토큰 디코딩 실패:", error);
      await clearSession();
      setIsAuthenticated(false);
      setShowLoginPopup(true);
    }
  };

  // ✅ 로그인 상태 감지
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // ✅ 로그인 함수
  const handleLogin = () => {
    window.location.href = COGNITO_LOGIN_URL;
  };

  // ✅ 로그아웃 함수
  const handleLogout = async () => {
    console.log("🛑 로그아웃 버튼 클릭됨!");
    await clearSession();
    setIsAuthenticated(false);
    router.push("/home");
  };

  // ✅ 팝업 확인 버튼 클릭 시 로그인 페이지로 이동
  const handlePopupConfirm = () => {
    setShowLoginPopup(false);
    handleLogin();
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
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold mb-4">
              로그인 세션이 만료되었습니다.
            </p>
            <button
              onClick={handlePopupConfirm}
              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
