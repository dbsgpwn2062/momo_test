"use client";

import React from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md transition bg-blue-500 text-white hover:bg-blue-600 ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
