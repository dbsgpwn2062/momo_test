"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import Image from "next/image";
import {
  getTokenFromCookies,
  clearSession,
  setUserInfoCookie,
} from "@/services/auth";
import styles from "@/styles/Header.module.css";

const COGNITO_LOGIN_URL =
  process.env.NEXT_PUBLIC_COGNITO_DOMAIN +
  `/login?client_id=${process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID}` +
  `&response_type=code&scope=email+openid+profile` +
  `&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}`;

const COGNITO_LOGOUT_URL = process.env.NEXT_PUBLIC_LOGOUT_URI || "/home";

const COGNITO_SIGN_UP_URL =
  process.env.NEXT_PUBLIC_COGNITO_DOMAIN +
  `/signup?client_id=${process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID}` +
  `&response_type=code&scope=email+openid+profile` +
  `&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}`;

export default function Header() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const checkAuthStatus = async () => {
    const idToken = await getTokenFromCookies();
    if (!idToken) {
      setIsAuthenticated(false);
      return;
    }
    try {
      const decodedToken: { exp?: number } = jwtDecode(idToken);
      const expTime = decodedToken.exp ? decodedToken.exp * 1000 : 0;
      const currentTime = Date.now();

      if (currentTime >= expTime) {
        await clearSession();
        setIsAuthenticated(false);
        setShowLoginPopup(true);
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      await clearSession();
      setIsAuthenticated(false);
      setShowLoginPopup(true);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleLogin = async () => {
    console.log("🚀 [handleLogin] 로그인 시작");

    window.location.href = COGNITO_LOGIN_URL;

    // 1️⃣ 로그인 후 리디렉트된 페이지에서 idToken 확인
    setTimeout(async () => {
      const idToken = await getTokenFromCookies();
      if (!idToken) {
        console.warn("❌ [handleLogin] idToken 없음");
        return;
      }

      console.log("✅ [handleLogin] idToken 가져옴:", idToken);

      // 2️⃣ 사용자 정보 저장
      await setUserInfoCookie();

      console.log("✅ [handleLogin] 유저 정보 쿠키 저장 완료!");

      // 3️⃣ 캘린더 API 호cnf
    }, 1000); // ✅ 1초 대기 후 실행 (비동기 쿠키 저장 반영 고려)
  };

  const handleLogout = async () => {
    await clearSession();
    setIsAuthenticated(false);
    setIsMenuOpen(false);
    window.location.href = COGNITO_LOGOUT_URL;
  };

  return (
    <header className={styles.header}>
      {/* ✅ 로고 */}
      <Link href="/home">
        <Image
          src="/momologo_textonly.png"
          alt="MOMO Logo"
          width={120}
          height={40}
          className={styles.logo}
        />
      </Link>

      <div className={styles.rightSection}>
        {/* ✅ 로그인/로그아웃 버튼 추가 */}
        {isAuthenticated ? (
          <button onClick={handleLogout} className={styles.authButton}>
            로그아웃
          </button>
        ) : (
          <button onClick={handleLogin} className={styles.authButton}>
            로그인
          </button>
        )}

        {/* ✅ 햄버거 버튼 */}
        <button
          className={styles.hamburger}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* ✅ 슬라이드 메뉴 */}
      <nav className={`${styles.sidebar} ${isMenuOpen ? styles.open : ""}`}>
        <button
          className={styles.closeButton}
          onClick={() => setIsMenuOpen(false)}
        >
          ✖
        </button>
        <ul className={styles.menu}>
          <li>
            <Link href="/home" onClick={() => setIsMenuOpen(false)}>
              🏠 홈
            </Link>
          </li>
          <li>
            <Link href="/search" onClick={() => setIsMenuOpen(false)}>
              🔍 영화 검색
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                  👤 회원정보 수정
                </Link>
              </li>
            </>
          ) : (
            <li>
              <button onClick={handleLogin} className={styles.loginButton}>
                🔑 회원가입
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* ✅ 로그인 만료 팝업 */}
      {showLoginPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupContainer}>
            <p className="text-lg font-semibold mb-4">
              로그인 세션이 만료되었습니다.
            </p>
            <button onClick={handleLogin} className={styles.popupButton}>
              확인
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
