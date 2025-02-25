"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ 페이지 이동을 위해 추가
import styles from "@/styles/SearchBar.module.css";
import Image from "next/image"; // Image 컴포넌트 import 추가

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
        placeholder="OTT 콘텐츠 검색"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()} // ✅ 엔터 키로 검색
        className={styles.searchInput}
      />
      <button className={styles.searchButton} onClick={handleSearch}>
        <Image src="/utils/search1.png" alt="검색" width={40} height={40} />
      </button>
    </div>
  );
}
