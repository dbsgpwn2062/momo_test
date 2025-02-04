"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { registerUser } from "@/services/auth"; // ✅ 회원가입 API 함수 가져오기

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // ✅ 폼 기본 제출 방지

    if (password !== password2) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const res = await registerUser(username, email, password, password2);

    if (res) {
      alert("회원가입 성공!");
      console.log("회원가입 응답:", res);
      // ✅ 회원가입 후 로그인 페이지로 이동 가능
    } else {
      alert("회원가입 실패! 입력 정보를 확인하세요.");
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <Input
        type="text"
        placeholder="사용자 이름"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        type="password"
        placeholder="비밀번호 확인"
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
      />
      {/* ✅ `onClick` 제거하고, `type="submit"` 추가 */}
      <Button text="회원가입" type="submit" />
    </form>
  );
}
