"use client";

import { useState, useEffect } from "react";
import { fetchMovies } from "@/services/search"; // ✅ 검색 서비스 불러오기
import styles from "@/styles/Search.module.css"; // ✅ CSS 모듈 적용

interface Movie {
  _id: string;
  _source: {
    Title: string;
    Genre: string;
    Platform: string;
    PosterURL: string;
  };
}

export default function MovieGrid({ searchQuery }: { searchQuery: string }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!searchQuery) return;
    setMovies([]);
    setPage(0);
    setHasMore(true);
    fetchMoreMovies(0, true);
  }, [searchQuery]);

  const fetchMoreMovies = async (pageNum: number, reset: boolean = false) => {
    if (!hasMore) return;
    setLoading(true);

    const newMovies = await fetchMovies(searchQuery, pageNum);
    setMovies((prev) => (reset ? newMovies : [...prev, ...newMovies]));
    setHasMore(newMovies.length > 0);
    setPage(pageNum + 1);
    setLoading(false);
  };

  return (
    <div className={styles.movieContainer}>
      <div className={styles.movieGrid}>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie._id} className={styles.movieCard}>
              <img
                src={movie._source.PosterURL}
                alt={movie._source.Title}
                className={styles.moviePoster}
              />
              <h3 className={styles.movieTitle}>{movie._source.Title}</h3>
              <p className={styles.moviePlatform}>{movie._source.Platform}</p>
            </div>
          ))
        ) : (
          <p className={styles.noResults}>검색 결과 없음</p>
        )}
      </div>

      {/* ✅ 로딩 메시지 */}
      {loading && <p className={styles.loading}>로딩 중...</p>}
    </div>
  );
}
