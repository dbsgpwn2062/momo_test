"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const query = new URLSearchParams(window.location.search);
      const code = query.get("code");

      if (!code) {
        router.push("/home");
        return;
      }

      try {
        // ✅ Next.js API로 요청하여 쿠키에 토큰 저장
        const response = await fetch(`/api/auth?code=${code}`, {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error();
        }

        router.push("/home"); // ✅ 로그인 완료 후 이동
      } catch {
        router.push("/home");
      }
    };

    handleAuth();
  }, []);

  return <div>로그인 처리 중...</div>;
}
