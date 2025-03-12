"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // ✅ 페이지 이동을 위한 useRouter 추가
import "@/styles/search.css";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ 검색 실행 함수 (페이지 이동)
  const handleSearch = () => {
    if (query.trim()) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("q", query.trim());

      // 기존 선택된 플랫폼 유지
      const platforms = searchParams.getAll("platform");
      params.delete("platform");
      platforms.forEach((p) => params.append("platform", p));

      router.push(`/search?${params.toString()}`);
    }
  };

  return (
    <div className="search-wrapper">
      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="콘텐츠 제목, 장르를 검색해보세요"
          className="search-input"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()} // ✅ Enter 키 입력 처리
        />
        <button onClick={handleSearch} className="search-btn">
          검색
        </button>
      </div>
    </div>
  );
}
