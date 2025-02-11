"use client";

import { COGNITO_LOGIN_URL } from "@/services/auth";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={() => (window.location.href = COGNITO_LOGIN_URL)}
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg"
      >
        로그인하기
      </button>
    </div>
  );
}
