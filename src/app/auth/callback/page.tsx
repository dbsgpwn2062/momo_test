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
        const response = await fetch(`/api/auth?code=${code}`, {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error();
        }

        router.push("/home");
      } catch {
        router.push("/home");
      }
    };

    handleAuth();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">로그인 처리 중...</h1>
    </div>
  );
}
