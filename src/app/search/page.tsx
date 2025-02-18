"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation"; // ✅ URL에서 검색어 가져오기
import SearchBar from "@/components/SearchForm/SearchBar";
import MovieGrid from "@/components/SearchForm/MovieGrid";
import "@/styles/search.css";

// 검색 컴포넌트를 별도로 분리
function SearchContent() {
  const searchParams = useSearchParams(); // ✅ URL에서 `q` 가져오기
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ URL의 검색어를 가져와 검색 실행
  useEffect(() => {
    const query = searchParams.get("q"); // ✅ `q` 값 가져오기
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]); // ✅ `searchParams` 변경될 때마다 실행

  return (
    <>
      <SearchBar />
      <MovieGrid searchQuery={searchQuery} />
    </>
  );
}

// 메인 페이지 컴포넌트
export default function MovieSearchPage() {
  return (
    <div className="searchPage">
      <Suspense fallback={<div>Loading...</div>}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
