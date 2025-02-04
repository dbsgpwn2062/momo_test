"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

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

    try {
      const res = await fetch("http://127.0.0.1:8000/users/register/", {
        // ✅ URL 확인
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, password2 }),
      });

      // ✅ 응답 데이터가 JSON인지 확인 후 파싱
      let data;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (res.status === 201) {
        alert("회원가입 성공!");
      } else {
        console.error("회원가입 실패:", data);
        alert(`회원가입 실패: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error("백엔드 요청 중 오류 발생:", error);
      alert("서버 오류 발생!");
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
