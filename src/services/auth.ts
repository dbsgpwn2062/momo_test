import { jwtDecode } from "jwt-decode";

// ✅ 환경변수에서 Cognito 설정 불러오기
const COGNITO_DOMAIN = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID!;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI!;
const LOGOUT_URI = process.env.NEXT_PUBLIC_LOGOUT_URI!;

// ✅ Cognito 로그인 URL
export const COGNITO_LOGIN_URL = `${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=code&scope=email+openid&redirect_uri=${REDIRECT_URI}`;

// ✅ Cognito 로그아웃 URL
export const COGNITO_LOGOUT_URL = "/api/auth";

// ✅ 세션 삭제 후 홈으로 이동
export const clearSession = async () => {
  console.warn("🚨 세션 만료: 백엔드에 로그아웃 요청");

  try {
    const response = await fetch("/api/auth/logout", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      console.error("❌ 로그아웃 실패:", await response.text());
      return;
    }

    console.log("✅ 로그아웃 성공: 쿠키 삭제 완료");
  } catch (error) {
    console.error("❌ 로그아웃 요청 중 오류 발생:", error);
  }

  window.location.href = "/home"; // ✅ 홈으로 리디렉트
};

// ✅ 쿠키에서 idToken 가져오기
export const getTokenFromCookies = async (): Promise<string | null> => {
  try {
    const response = await fetch("/api/auth/check", {
      method: "GET",
      credentials: "include", // ✅ 쿠키 포함하여 요청
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.idToken || null;
  } catch (error) {
    console.error("❌ 쿠키에서 idToken 가져오기 실패:", error);
    return null;
  }
};

// ✅ idToken을 쿠키에 저장
export function setTokenCookie(idToken: string, expiresIn: number) {
  const expires = new Date(Date.now() + expiresIn * 1000).toUTCString();
  document.cookie = `idToken=${idToken}; Path=/; Expires=${expires}; Secure; HttpOnly; SameSite=Strict`;
}

interface DecodedToken {
  nickname?: string;
  email?: string;
  [key: string]: any; // ✅ 기타 속성 허용
}

export async function getUserInfo() {
  const idToken = await getTokenFromCookies();
  if (!idToken) return null;

  try {
    // ✅ 타입을 명확히 지정하여 디코딩
    const decodedToken: DecodedToken = jwtDecode(idToken);

    return {
      nickname: decodedToken.nickname || "닉네임 없음",
      email: decodedToken.email || "이메일 없음",
    };
  } catch (error) {
    console.error("❌ 토큰 디코딩 실패:", error);
    return null;
  }
}
