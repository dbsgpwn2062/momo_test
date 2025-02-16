import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// ✅ 1시간 (3600초) 동안 유지
const COOKIE_EXPIRE_TIME = 1 / 24; // 1시간 (1/24일)

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
    await fetch("/api/auth/logout", { method: "GET", credentials: "include" });

    Cookies.remove("id_token");
    Cookies.remove("user_info");

    window.location.href = "/home"; // ✅ 홈으로 리디렉트
  } catch (error) {
    console.error("❌ 로그아웃 요청 실패:", error);
  }
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

// ✅ 사용자 정보 쿠키에 저장 (1시간) - 로그인 후 실행
export const setUserInfoCookie = async (retryCount = 0) => {
  const idToken = await getTokenFromCookies();
  if (!idToken) {
    console.warn(`⚠️ [setUserInfoCookie] idToken 없음 (재시도 ${retryCount})`);

    // 최대 3번까지 재시도 (500ms 간격)
    if (retryCount < 3) {
      setTimeout(() => setUserInfoCookie(retryCount + 1), 500);
    }
    return;
  }

  try {
    const decodedToken: DecodedToken = jwtDecode(idToken);
    const nickname = decodedToken.nickname || "닉네임 없음";
    const email = decodedToken.email || "이메일 없음";

    const res = await fetch("/api/userinfo");
    if (!res.ok) throw new Error("❌ 유저 정보 가져오기 실패");

    const userInfo = await res.json();

    // ✅ 쿠키에 1시간 저장
    Cookies.set(
      "user_info",
      JSON.stringify({
        nickname,
        email,
        mbti: userInfo.mbti || "",
        subscribe_platform: userInfo.subscribe_platform || [],
      }),
      { expires: COOKIE_EXPIRE_TIME }
    );

    console.log("✅ [setUserInfoCookie] 유저 정보 쿠키 저장 완료!");
  } catch (error) {
    console.error("❌ 유저 정보 저장 실패:", error);
  }
};

// ✅ 쿠키에서 유저 정보 가져오기
export const getUserInfoFromCookies = () => {
  const userInfo = Cookies.get("user_info");
  return userInfo ? JSON.parse(userInfo) : null;
};
