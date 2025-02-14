"use client";

import { useEffect, useState } from "react";
import "@/styles/search.css"; // ✅ CSS 적용

interface Movie {
  _id: string;
  _source: {
    Title: string;
    Genre: string;
    Platform: string;
    PosterURL: string;
    Synopsis: string;
    Rating: string;
    Runtime: string;
    Country: string;
    ReleaseDate: string;
  };
}

export default function MovieGrid({ searchQuery }: { searchQuery: string }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 48; // ✅ 한 번에 불러오는 데이터 개수

  // 🔄 검색어 변경 시 초기화
  useEffect(() => {
    if (!searchQuery) return;

    setMovies([]);
    setPage(0);
    setHasMore(true);
    fetchMovies(0, true);
  }, [searchQuery]);

  // 📡 API 호출 (무한 스크롤 적용)
  const fetchMovies = async (pageNum: number, reset: boolean = false) => {
    if (!hasMore) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/search?q=${searchQuery}&page=${pageNum}`);
      const data = await res.json();
      const newMovies: Movie[] = data.hits.hits || [];

      setMovies((prev) => {
        const mergedMovies: Movie[] = reset
          ? newMovies
          : [...prev, ...newMovies];
        const uniqueMovies: Movie[] = Array.from(
          new Map(mergedMovies.map((m) => [m._id, m])).values()
        );
        return uniqueMovies;
      });

      setHasMore(newMovies.length === PAGE_SIZE);
      setPage(pageNum + 1); // ✅ 다음 페이지 증가
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🎢 무한 스크롤 감지 이벤트
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        !loading &&
        hasMore
      ) {
        fetchMovies(page);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  // 🎬 팝업 닫기 함수 (배경 클릭 또는 ESC 키)
  const closePopup = () => setSelectedMovie(null);

  // 🛑 ESC 키 이벤트 추가
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePopup();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="movie-container">
      {loading && <p></p>}

      <div className="movie-grid">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div
              key={movie._id}
              className="movie-card"
              onClick={() => setSelectedMovie(movie)}
            >
              {/* 🎬 영화 포스터 */}
              <img
                src={movie._source.PosterURL}
                alt={movie._source.Title}
                className="movie-poster"
              />

              {/* 🎬 영화 제목 */}
              <h3 className="movie-title">{movie._source.Title}</h3>

              {/* 🏷️ 플랫폼 정보 */}
              <p className="movie-platform">{movie._source.Platform}</p>
            </div>
          ))
        ) : (
          <p>검색 결과 없음</p>
        )}
      </div>

      {/* 🎬 영화 상세 팝업 */}
      {selectedMovie && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closePopup}>
              ✖
            </button>
            <h2>{selectedMovie._source.Title}</h2>
            <img
              src={selectedMovie._source.PosterURL}
              alt={selectedMovie._source.Title}
              className="popup-poster"
            />
            <p>
              <strong>장르:</strong> {selectedMovie._source.Genre}
            </p>
            <p>
              <strong>플랫폼:</strong> {selectedMovie._source.Platform}
            </p>
            <p>
              <strong>줄거리:</strong> {selectedMovie._source.Synopsis}
            </p>
            <p>
              <strong>평점:</strong> {selectedMovie._source.Rating}
            </p>
            <p>
              <strong>상영 시간:</strong> {selectedMovie._source.Runtime}
            </p>
            <p>
              <strong>국가:</strong> {selectedMovie._source.Country}
            </p>
            <p>
              <strong>개봉일:</strong> {selectedMovie._source.ReleaseDate}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
