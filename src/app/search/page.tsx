"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchForm/SearchBar";
import MovieGrid from "@/components/SearchForm/MovieGrid";
import styles from "@/styles/Search.module.css"; // ✅ CSS 모듈 적용

export default function MovieSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className={styles.container}>
      {" "}
      {/* ✅ 스타일 적용 */}
      <SearchBar onSearch={setSearchQuery} />
      {searchQuery ? (
        <MovieGrid searchQuery={searchQuery} />
      ) : (
        <p className={styles.noResults}>🎬 영화를 검색해주세요!</p> // ✅ 검색 전 메시지 추가
      )}
    </div>
  );
}
