"use client";

import { COGNITO_LOGOUT_URL } from "@/services/auth";

export default function LogoutPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={() => (window.location.href = COGNITO_LOGOUT_URL)}
        className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg"
      >
        로그아웃하기
      </button>
    </div>
  );
}
