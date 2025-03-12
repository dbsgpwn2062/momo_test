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
    const trimmedQuery = query.trim();
    console.log("Search query:", trimmedQuery); // 디버깅용 로그

    if (trimmedQuery) {
      const searchUrl = `/search?q=${encodeURIComponent(trimmedQuery)}`;
      console.log("Redirecting to:", searchUrl); // 디버깅용 로그

      router.push(searchUrl);
    }
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="OTT 콘텐츠 검색"
        value={query}
        onChange={(e) => {
          console.log("Input value:", e.target.value); // 디버깅용 로그
          setQuery(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            console.log("Enter key pressed"); // 디버깅용 로그
            handleSearch();
          }
        }}
        className={styles.searchInput}
      />
      <button
        className={styles.searchButton}
        onClick={() => {
          console.log("Search button clicked"); // 디버깅용 로그
          handleSearch();
        }}
      >
        <Image src="/utils/search1.png" alt="검색" width={40} height={40} />
      </button>
    </div>
  );
}
