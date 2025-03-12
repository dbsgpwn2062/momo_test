"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/Search.module.css"; // CSS 모듈 임포트

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
const PLATFORM_ICONS: { [key: string]: string } = {
  넷플릭스: "/icon-ott/icon-netflix.webp",
  티빙: "/icon-ott/icon-tving.webp",
  웨이브: "/icon-ott/icon-wavve.webp",
  디즈니: "/icon-ott/icon-disney+.webp",
  왓챠: "/icon-ott/icon-watcha.webp",
  쿠팡플레이: "/icon-ott/icon-coupangplay.webp",
};

const PLATFORM_URLS: { [key: string]: string } = {
  넷플릭스: "https://www.netflix.com/kr/",
  티빙: "https://www.tving.com",
  웨이브: "https://www.wavve.com",
  디즈니: "https://www.disneyplus.com/ko-kr",
  왓챠: "https://watcha.com",
  쿠팡플레이: "https://www.coupangplay.com",
};

// ✅ 기존 기능 + selectedPlatforms 추가
export default function MovieGrid({
  searchQuery,
  selectedPlatforms,
}: {
  searchQuery: string;
  selectedPlatforms: string[];
}) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 25;

  // 초기 로딩 및 검색어/플랫폼 변경 시 실행
  useEffect(() => {
    setMovies([]);
    setPage(0);
    setHasMore(true);
    if (searchQuery.trim()) {
      fetchMovies(0, true);
    }
  }, [searchQuery, selectedPlatforms]);

  const fetchMovies = async (pageNum: number, reset: boolean = false) => {
    if (!hasMore || loading) return;
    setLoading(true);

    try {
      const url = new URL(`/api/search`, window.location.origin);
      // searchQuery가 있을 때만 검색어 파라미터 추가
      if (searchQuery.trim()) {
        url.searchParams.append("q", searchQuery);
      }
      url.searchParams.append("page", pageNum.toString());

      selectedPlatforms.forEach((platform) =>
        url.searchParams.append("platform", platform)
      );

      const res = await fetch(url.toString());
      const data = await res.json();
      const newMovies: Movie[] = data.hits.hits || [];

      setMovies((prev) => (reset ? newMovies : [...prev, ...newMovies]));

      const total = data.hits.total.value;
      const hasMoreItems = (pageNum + 1) * PAGE_SIZE < total;
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

      if (scrollPosition >= threshold && !loading && hasMore) {
        fetchMovies(page);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page, searchQuery, selectedPlatforms]); // ✅ 플랫폼도 의존성에 추가

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

  // 영화 카드용 플랫폼 아이콘 렌더링 함수
  const renderPlatformIcons = (platformString: string) => {
    const platforms = platformString.split(",").map((p) => p.trim());
    return (
      <div className={styles["platform-icons"]}>
        {platforms.map((platform, index) => (
          <img
            key={index}
            src={PLATFORM_ICONS[platform] || "/platforms/default.png"}
            alt={platform}
            className={styles["platform-icon"]}
            title={platform}
          />
        ))}
      </div>
    );
  };

  // 팝업용 플랫폼 아이콘 렌더링 함수
  const renderPopupPlatformIcons = (platformString: string) => {
    const platforms = platformString.split(",").map((p) => p.trim());
    return (
      <div className={styles["popup-platform-icons"]}>
        {platforms.map((platform, index) => (
          <button
            key={index}
            className={styles["platform-button"]}
            onClick={(e) => {
              e.stopPropagation(); // 팝업이 닫히는 것을 방지
              window.open(PLATFORM_URLS[platform], "_blank");
            }}
            title={`${platform}에서 보기`}
          >
            <img
              src={PLATFORM_ICONS[platform] || "/platforms/default.png"}
              alt={platform}
              className={styles["popup-platform-icon"]}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={styles["movie-container"]}>
      {loading && <p>Loading...</p>}

      <div className={styles["movie-grid"]}>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div
              key={movie._id}
              className={styles["movie-card"]}
              onClick={() => setSelectedMovie(movie)}
            >
              <img
                src={movie._source.poster_url}
                alt={movie._source.title}
                className={styles["movie-poster"]}
              />
              <h3 className={styles["movie-title"]}>{movie._source.title}</h3>
              {renderPlatformIcons(movie._source.platform)}
            </div>
          ))
        ) : (
          <p>검색 결과 없음</p>
        )}
      </div>

      {/* 🎬 영화 상세 팝업 */}
      {selectedMovie && (
        <div className={styles["popup-overlay"]} onClick={closePopup}>
          <div
            className={styles["popup-content"]}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles["close-btn"]} onClick={closePopup}>
              ✖
            </button>
            <div className={styles["popup-scroll-container"]}>
              <h2>{selectedMovie._source.title}</h2>
              <img
                src={selectedMovie._source.poster_url}
                alt={selectedMovie._source.title}
                className={styles["popup-poster"]}
              />

              {renderPopupPlatformIcons(selectedMovie._source.platform)}
              <p>
                <strong>장르:</strong> {selectedMovie._source.genre}
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
        </div>
      )}
    </div>
  );
}
