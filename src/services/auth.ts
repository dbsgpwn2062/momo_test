const COGNITO_DOMAIN = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID!;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI!;
const LOGOUT_URI = process.env.NEXT_PUBLIC_LOGOUT_URI!;

// ✅ Cognito 로그인 URL (로그인 후 API 서버를 통해 쿠키 저장)
export const COGNITO_LOGIN_URL = `${COGNITO_DOMAIN}/login?client_id=${CLIENT_ID}&response_type=code&scope=email+openid&redirect_uri=${REDIRECT_URI}`;

// ✅ Cognito 로그아웃 URL (쿠키 삭제 후 홈으로 이동)
export const COGNITO_LOGOUT_URL = "/api/auth";

export const clearSession = () => {
  console.warn("🚨 세션 만료: 쿠키 삭제 및 로그아웃");
  document.cookie = "idToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie =
    "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.href = "/home"; // ✅ 홈으로 리디렉트
};

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
