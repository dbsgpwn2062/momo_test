"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import Image from "next/image";
import { getTokenFromCookies, clearSession } from "@/services/auth";
import styles from "@/styles/Header.module.css";

// ✅ 환경변수에서 Cognito 로그인 & 로그아웃 경로 가져오기
const COGNITO_LOGIN_URL =
  process.env.NEXT_PUBLIC_COGNITO_DOMAIN +
  `/login?client_id=${process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID}` +
  `&response_type=code&scope=email+openid+profile` +
  `&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}`;

const COGNITO_LOGOUT_URL =
  process.env.NEXT_PUBLIC_COGNITO_DOMAIN +
  `/logout?client_id=${process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID}` +
  `&logout_uri=${process.env.NEXT_PUBLIC_LOGOUT_URI}`;

const COGNITO_SIGN_UP_URL =
  process.env.NEXT_PUBLIC_COGNITO_DOMAIN +
  `/signup?client_id=${process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID}` +
  `&response_type=code&scope=email+openid+profile` +
  `&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}`;

export default function Header() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // ✅ 햄버거 메뉴 상태

  // ✅ 로그인 상태 확인
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

  // ✅ 로그인 상태 감지
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // ✅ 로그인 함수 (Cognito 페이지로 이동)
  const handleLogin = () => {
    window.location.href = COGNITO_LOGIN_URL;
  };

  // ✅ 회원가입 함수 (Cognito 페이지로 이동)
  const handleSignUp = () => {
    window.location.href = COGNITO_SIGN_UP_URL;
  };

  // ✅ 로그아웃 함수 (Cognito 로그아웃 후 홈으로 이동)
  const handleLogout = async () => {
    await clearSession();
    setIsAuthenticated(false);
    setIsMenuOpen(false); // 메뉴 닫기
    window.location.href = COGNITO_LOGOUT_URL; // Cognito 로그아웃 처리
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

      {/* ✅ 햄버거 버튼 */}
      <button
        className={styles.hamburger}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        ☰
      </button>

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
              <li className={styles.logout} onClick={handleLogout}>
                🚪 로그아웃
              </li>
            </>
          ) : (
            <li>
              <button onClick={handleSignUp} className={styles.loginButton}>
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
