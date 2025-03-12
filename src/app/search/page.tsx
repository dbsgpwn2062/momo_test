"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/ui/Header";
import SearchBar from "@/components/SearchForm/SearchBar";
import MovieGrid from "@/components/SearchForm/MovieGrid";
import PlatformFilter from "@/components/SearchForm/PlatformFilter"; // ✅ 추가
import "@/styles/search.css";

function SearchContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  // URL 파라미터 변경 감지
  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchQuery(query);

    // 플랫폼 파라미터 가져오기
    const platforms = searchParams.getAll("platform");
    setSelectedPlatforms(platforms);
  }, [searchParams]); // searchParams가 변경될 때마다 실행

  return (
    <>
      <SearchBar />
      <PlatformFilter
        selectedPlatforms={selectedPlatforms}
        setSelectedPlatforms={setSelectedPlatforms}
      />
      <MovieGrid
        searchQuery={searchQuery}
        selectedPlatforms={selectedPlatforms}
      />{" "}
      {/* ✅ 플랫폼 필터 전달 */}
    </>
  );
}

export default function MovieSearchPage() {
  return (
    <>
      <Header />
      <div className="searchPage">
        <Suspense fallback={<div>Loading...</div>}>
          <SearchContent />
        </Suspense>
      </div>
    </>
  );
}
