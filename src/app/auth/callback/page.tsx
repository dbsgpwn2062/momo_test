"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const query = new URLSearchParams(window.location.search);
      const code = query.get("code");

      if (!code) {
        router.push("/login");
        return;
      }

      try {
        const tokenResponse = await fetch(
          `${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "authorization_code",
              client_id: process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID!,
              client_secret: process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_SECRET!,
              code,
              redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI!,
            }),
          }
        );

        if (!tokenResponse.ok) {
          throw new Error();
        }

        const tokenData = await tokenResponse.json();

        if (!tokenData.access_token || !tokenData.id_token) {
          throw new Error();
        }

        // JWT 디코딩하여 회원 정보 추출
        const decodedUser = jwtDecode(tokenData.id_token);

        // 사용자 정보를 sessionStorage에 저장
        sessionStorage.setItem("accessToken", tokenData.access_token);
        sessionStorage.setItem("idToken", tokenData.id_token);
        sessionStorage.setItem("refreshToken", tokenData.refresh_token);
        sessionStorage.setItem("userInfo", JSON.stringify(decodedUser)); // 사용자 정보 저장

        router.push("/main");
      } catch {
        router.push("/login");
      }
    };

    handleAuth();
  }, []);

  return <div>로그인 처리 중...</div>;
}
