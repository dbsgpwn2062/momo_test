"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [mbti, setMbti] = useState("");
  const [subscribePlatform, setSubscribePlatform] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // 페이지 로드 시 회원 정보 가져오기
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const res = await fetch("/api/userinfo");
        if (!res.ok) throw new Error("Failed to fetch user info");

        const data = await res.json();
        setMbti(data.mbti || "");
        setSubscribePlatform(data.subscribe_platform || "");
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserInfo();
  }, []); // 빈 배열로 설정하여 최초 1회 실행

  // 사용자 정보 업데이트
  async function handleUpdate() {
    setMessage("");
    try {
      const res = await fetch("/api/userinfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mbti, subscribe_platform: subscribePlatform }),
      });

      const data = await res.json();
      setMessage(data.message || "Update failed");
    } catch (error) {
      setMessage("An error occurred.");
      console.error(error);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded-lg shadow-lg">
      <h1 className="text-xl font-bold mb-4">회원정보</h1>

      <label className="block mb-2">
        MBTI:
        <input
          type="text"
          value={mbti}
          onChange={(e) => setMbti(e.target.value)}
          className="block w-full mt-1 p-2 border rounded"
        />
      </label>

      <label className="block mb-2">
        구독 플랫폼:
        <input
          type="text"
          value={subscribePlatform}
          onChange={(e) => setSubscribePlatform(e.target.value)}
          className="block w-full mt-1 p-2 border rounded"
        />
      </label>

      <button
        onClick={handleUpdate}
        className="w-full bg-blue-500 text-white py-2 rounded mt-4"
      >
        저장하기
      </button>

      {message && <p className="mt-3 text-center text-green-500">{message}</p>}
    </div>
  );
}
