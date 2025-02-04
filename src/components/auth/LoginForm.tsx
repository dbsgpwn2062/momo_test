"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import Button from "@/components/ui/Button";
import { loginUser } from "@/services/auth";

interface LoginFormProps {
  setAuthMode: Dispatch<SetStateAction<"login" | "register">>;
}

const LoginForm: React.FC<LoginFormProps> = ({ setAuthMode }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await loginUser(username, password);

    if (res) {
      alert("로그인 성공!");
      console.log("로그인 응답:", res);
    } else {
      alert("로그인 실패! 아이디 또는 비밀번호를 확인하세요.");
    }
  };

  return (
    <div className="auth-card w-96">
      <div className="flex flex-col items-center space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          Login
        </h2>
        <p className="text-sm text-gray-500 text-center">Glad you're back!</p>
      </div>

      {/* 로그인 폼 */}
      <form className="flex flex-col gap-8 w-full" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="auth-input h-12"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input h-12"
        />
        <div className="flex flex-col gap-2">
          <Button text="Login" type="submit" className="auth-button h-12" />
          <Button
            text="Sign Up"
            type="button"
            className="auth-button h-12 bg-gradient-to-r from-gray-400 to-gray-500"
            onClick={() => setAuthMode("register")}
          />
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
