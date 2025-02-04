"use client";

import React, { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import "@/styles/auth.css";

const AuthContainer: React.FC = () => {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  return (
    <div
      className="auth-container flex justify-center items-center h-screen w-full"
      style={{
        backgroundImage: `url('/unicorn-pastel-phone-wallpaper-background.jpg')`,
      }}
    >
      <div className="flex w-full max-w-[1000px]">
        {/* 왼쪽 섹션: 로고 */}
        <div className="w-1/2 flex items-center justify-center">
          <img
            src="/momo.png"
            alt="Momo Logo"
            className="w-64 h-auto object-contain"
          />
        </div>

        {/* 오른쪽 섹션: 로그인 또는 회원가입 폼 */}
        <div className="w-1/2 flex items-center justify-center">
          {authMode === "login" ? (
            <LoginForm setAuthMode={setAuthMode} />
          ) : (
            <RegisterForm setAuthMode={setAuthMode} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;
