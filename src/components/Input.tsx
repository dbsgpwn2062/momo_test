import React from "react";

interface InputProps {
  label: string;
  type?: string;
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({ label, type = "text", placeholder }) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="border rounded-md px-4 py-2 focus:outline-blue-500"
      />
    </div>
  );
};

export default Input;
