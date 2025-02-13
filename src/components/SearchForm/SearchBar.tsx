"use client";

import { useState } from "react";
import styles from "@/styles/Search.module.css"; // ✅ CSS 모듈 적용

export default function SearchBar({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [query, setQuery] = useState("");

  // ✅ 검색 실행 함수
  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <div className={styles.searchWrapper}>
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Movie Title ..."
          className={styles.searchInput}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()} // ✅ Enter 키 검색 추가
        />
        <button onClick={handleSearch} className={styles.searchBtn}>
          Search
        </button>
      </div>
    </div>
  );
}
