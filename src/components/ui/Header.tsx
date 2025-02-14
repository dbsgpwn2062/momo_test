"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import Image from "next/image";
import { getTokenFromCookies, clearSession } from "@/services/auth";
import { COGNITO_LOGIN_URL } from "@/services/auth";
import styles from "@/styles/Header.module.css"; // ✅ CSS 모듈 적용

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
    <header className={styles.header}>
      {/* ✅ 햄버거 버튼 추가 */}
      <button className={styles.hamburger}>☰</button>

      {/* ✅ 로고 이미지 적용 */}
      <Link href="/home">
        <Image
          src="/momologo_textonly.png" // public 폴더에서 자동 참조됨
          alt="MOMO Logo"
          width={120} // 적절한 크기로 조정
          height={40}
          className={styles.logo}
        />
      </Link>

      <nav className={styles.nav}>
        {!isAuthenticated ? (
          <button
            onClick={handleLogin}
            className={`${styles.button} ${styles.loginButton}`}
          >
            로그인
          </button>
        ) : (
          <button
            onClick={handleLogout}
            className={`${styles.button} ${styles.logoutButton}`}
          >
            로그아웃
          </button>
        )}
      </nav>

      {/* ✅ 로그인 만료 팝업 */}
      {showLoginPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContainer}>
            <p className="text-lg font-semibold mb-4">
              로그인 세션이 만료되었습니다.
            </p>
            <button onClick={handlePopupConfirm} className={styles.popupButton}>
              확인
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
