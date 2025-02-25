"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ 페이지 이동을 위한 useRouter 추가
import "@/styles/search.css";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter(); // ✅ Next.js 라우터

  // ✅ 검색 실행 함수 (페이지 이동)
  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`); // ✅ URL로 이동
    }
  };

  return (
    <div className="search-wrapper">
      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Movie Title ..."
          className="search-input"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()} // ✅ Enter 키 입력 처리
        />
        <button onClick={handleSearch} className="search-btn">
          Search
        </button>
      </div>
    </div>
  );
}
