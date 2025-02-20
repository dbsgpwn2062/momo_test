"use client";

import { useEffect, useState } from "react";
import "@/styles/search.css"; // ✅ CSS 적용

interface Movie {
  _id: string;
  _source: {
    title: string;
    genre: string;
    platform: string;
    poster_url: string;
    synopsis: string;
    rating: string;
    runtime: string;
    country: string;
    releaseDate: string;
  };
}

export default function MovieGrid({ searchQuery }: { searchQuery: string }) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 25; // API route.ts와 동일한 값으로 설정

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
    if (!hasMore || loading) return; // loading 체크 추가
    setLoading(true);
    console.log(`Fetching movies for page: ${pageNum}`);

    try {
      const res = await fetch(`/api/search?q=${searchQuery}&page=${pageNum}`);
      const data = await res.json();
      console.log("API Response:", data);
      const newMovies: Movie[] = data.hits.hits || [];
      console.log("New Movies length:", newMovies.length);

      setMovies((prev) => {
        const mergedMovies: Movie[] = reset
          ? newMovies
          : [...prev, ...newMovies];
        console.log("Merged Movies length:", mergedMovies.length);
        return mergedMovies; // 중복 제거 로직 제거
      });

      // hasMore 상태 업데이트 로직 수정
      const total = data.hits.total.value;
      const hasMoreItems = (pageNum + 1) * PAGE_SIZE < total;
      console.log("Has more items:", hasMoreItems, "Total:", total);
      setHasMore(hasMoreItems);

      setPage(pageNum + 1);
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🎢 무한 스크롤 감지 이벤트
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.body.offsetHeight - 300;

      console.log("Scroll Position:", scrollPosition, "Threshold:", threshold);

      if (scrollPosition >= threshold && !loading && hasMore) {
        console.log("Loading more movies... Page:", page);
        fetchMovies(page);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page, searchQuery]); // searchQuery 의존성 추가

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

  // movies 상태가 변경될 때마다 로그 출력
  useEffect(() => {
    console.log("Movies state updated:", movies);
  }, [movies]);

  return (
    <div className="movie-container">
      {loading && <p>Loading...</p>}

      <div className="movie-grid">
        {movies.length > 0 ? (
          movies.map((movie) => {
            console.log("Rendering movie:", movie._source); // 각 영화 데이터 확인
            return (
              <div
                key={movie._id}
                className="movie-card"
                onClick={() => setSelectedMovie(movie)}
              >
                <img
                  src={movie._source.poster_url}
                  alt={movie._source.title}
                  className="movie-poster"
                />
                <h3 className="movie-title">{movie._source.title}</h3>
                <p className="movie-platform">{movie._source.platform}</p>
              </div>
            );
          })
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
            <h2>{selectedMovie._source.title}</h2>
            <img
              src={selectedMovie._source.poster_url}
              alt={selectedMovie._source.title}
              className="popup-poster"
            />
            <p>
              <strong>장르:</strong> {selectedMovie._source.genre}
            </p>
            <p>
              <strong>플랫폼:</strong> {selectedMovie._source.platform}
            </p>
            <p>
              <strong>줄거리:</strong> {selectedMovie._source.synopsis}
            </p>
            <p>
              <strong>평점:</strong> {selectedMovie._source.rating}
            </p>
            <p>
              <strong>상영 시간:</strong> {selectedMovie._source.runtime}
            </p>
            <p>
              <strong>국가:</strong> {selectedMovie._source.country}
            </p>
            <p>
              <strong>개봉일:</strong> {selectedMovie._source.releaseDate}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
