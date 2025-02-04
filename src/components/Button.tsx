"use client";

import React from "react";

interface ButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md transition ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
