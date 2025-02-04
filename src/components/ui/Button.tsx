"use client";

import React from "react";

interface ButtonProps {
  text: string;
  type?: "button" | "submit" | "reset"; // ✅ 버튼 타입 지원
  onClick?: () => void; // ✅ `onClick` 선택적 사용 가능
  className?: string; // ✅ 추가적인 스타일 적용 가능
}

const Button: React.FC<ButtonProps> = ({
  text,
  type = "button", // ✅ 기본값 "button"
  onClick,
  className = "bg-blue-500 text-white hover:bg-blue-600", // ✅ 기본 스타일 추가
}) => {
  return (
    <button
      type={type} // ✅ `type` 속성 적용
      onClick={onClick}
      className={`px-4 py-2 rounded-md transition ${className}`} // ✅ 공통 스타일 적용
    >
      {text}
    </button>
  );
};

export default Button;
