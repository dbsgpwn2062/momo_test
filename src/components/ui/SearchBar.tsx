"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ 페이지 이동을 위해 추가
import styles from "@/styles/SearchBar.module.css";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter(); // ✅ useRouter 추가

  // ✅ 검색 실행 함수
  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`); // ✅ 검색어를 URL에 포함해 이동
    }
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="콘텐츠 검색..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()} // ✅ 엔터 키로 검색
        className={styles.searchInput}
      />
      <button className={styles.searchButton} onClick={handleSearch}>
        🔍
      </button>
    </div>
  );
}
