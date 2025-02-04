"use client";

import { useState, Dispatch, SetStateAction } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { registerUser } from "@/services/auth";

interface RegisterFormProps {
  setAuthMode: Dispatch<SetStateAction<"login" | "register">>;
}

export default function RegisterForm({ setAuthMode }: RegisterFormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== password2) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const res = await registerUser(username, email, password, password2);

    if (res) {
      alert("회원가입 성공!");
      console.log("회원가입 응답:", res);
    } else {
      alert("회원가입 실패! 입력 정보를 확인하세요.");
    }
  };

  return (
    <div className="auth-card w-96">
      <div className="flex flex-col items-center space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          Sign Up
        </h2>
        <p className="text-sm text-gray-500 text-center">
          Create a new account
        </p>
      </div>

      {/* 회원가입 폼 */}
      <form className="flex flex-col gap-8 w-full" onSubmit={handleRegister}>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="auth-input h-12"
        />
        <Input
          type="Email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input h-12"
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input h-12"
        />
        <Input
          type="password"
          placeholder="Confirm password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          className="auth-input h-12"
        />
        <div className="flex flex-col gap-2">
          <Button text="Sign Up" type="submit" className="auth-button h-12" />
          <Button
            text="Back to Login"
            type="button"
            className="auth-button h-12 bg-gradient-to-r from-gray-400 to-gray-500"
            onClick={() => setAuthMode("login")}
          />
        </div>
      </form>
    </div>
  );
}
