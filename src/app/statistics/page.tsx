"use client";

import { useState, useEffect, useRef } from "react";
import "@/styles/statistics.css"; // ✅ CSS 적용
import Image from "next/image";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// 감정별 이모지 맵핑
const EMOTION_ICONS: { [key: string]: string } = {
  happy: "/emotion/happy.png",
  love: "/emotion/love.png",
  angry: "/emotion/annoyance.png",
  crying: "/emotion/sadness.png",
  scared: "/emotion/surprise.png",
  shame: "/emotion/anxiety.png",
  confusion: "/emotion/neutral.png",
};

const STATISTICS_TYPES = ["감정별 통계", "개인 통계", "월별 통계", "전체 통계"];

export default function StatisticsPage() {
  const [selectedType, setSelectedType] = useState(STATISTICS_TYPES[0]); // ✅ 선택한 드롭다운 상태
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ 외부 클릭 감지해서 드롭다운 닫기
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // ✅ 감정별 콘텐츠 통계
  const emotionStats = [
    {
      emotion: "happy",
      title: "행복한 콘텐츠 순위",
      movies: [
        "해피 무비",
        "웃음 가득 영화",
        "코미디 명작",
        "감동적인 스토리",
        "따뜻한 가족 영화",
        "힐링 드라마",
        "음악 영화",
        "감성 다큐",
        "코믹 애니메이션",
        "즐거운 모험 영화",
      ],
    },
    {
      emotion: "love",
      title: "설레는 콘텐츠 순위",
      movies: [
        "로맨틱 영화",
        "연애 이야기",
        "달달한 코미디",
        "사랑의 드라마",
        "감성 로맨스",
        "첫사랑 영화",
        "데이트 무비",
        "로맨틱 코미디",
        "설레는 청춘 영화",
        "순수한 사랑 이야기",
      ],
    },
    {
      emotion: "angry",
      title: "화나는 콘텐츠 순위",
      movies: [
        "액션 폭발",
        "복수극 영화",
        "강렬한 스릴러",
        "정의 구현 영화",
        "범죄 추적 영화",
        "긴장감 넘치는 영화",
        "분노 유발 다큐",
        "격렬한 스포츠 영화",
        "경쟁과 도전 영화",
        "폭발적인 전쟁 영화",
      ],
    },
    {
      emotion: "crying",
      title: "슬픈 콘텐츠 순위",
      movies: [
        "눈물 나는 영화",
        "감동 스토리",
        "드라마 명작",
        "가슴 아픈 사랑 이야기",
        "인생을 바꾼 영화",
        "실화 바탕 감동작",
        "가족 이야기",
        "이별의 아픔",
        "운명적인 이야기",
        "슬픈 애니메이션",
      ],
    },
    {
      emotion: "scared",
      title: "무서운 콘텐츠 순위",
      movies: [
        "공포 영화",
        "소름 돋는 이야기",
        "심리 스릴러",
        "귀신 나오는 영화",
        "살인마 스토리",
        "실화 기반 공포",
        "공포 애니메이션",
        "어두운 분위기",
        "괴물 이야기",
        "어둠 속 영화",
      ],
    },
    {
      emotion: "shame",
      title: "부끄러운 콘텐츠 순위",
      movies: [
        "유치한 영화",
        "웃기지만 창피한 영화",
        "민망한 장면 가득",
        "낯선 로맨스",
        "무대 사고",
        "실패담",
        "어색한 순간들",
        "예상치 못한 실수",
        "부끄러운 다큐",
        "실수 연발 코미디",
      ],
    },
    {
      emotion: "confusion",
      title: "혼란스러운 콘텐츠 순위",
      movies: [
        "이해하기 어려운 영화",
        "복잡한 플롯",
        "미스터리 스릴러",
        "반전 영화",
        "다중 시점 영화",
        "논리적 사고 도전",
        "꿈속 같은 이야기",
        "퍼즐 같은 플롯",
        "시간 여행 영화",
        "철학적인 스토리",
      ],
    },
  ];

  const personalStats = [
    { name: "행복", count: 30 },
    { name: "설렘", count: 20 },
    { name: "화남", count: 10 },
    { name: "슬픔", count: 15 },
    { name: "공포", count: 12 },
    { name: "부끄러움", count: 8 },
    { name: "혼란", count: 5 },
  ];

  const monthlyStats = [
    { month: "1월", count: 100 },
    { month: "2월", count: 90 },
    { month: "3월", count: 120 },
    { month: "4월", count: 80 },
    { month: "5월", count: 130 },
  ];

  const totalStats = personalStats.map((stat) => ({
    name: stat.name,
    value: stat.count,
  }));

  const renderChart = (labels: string[], data: number[], label: string) => (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label,
            data,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      }}
    />
  );

  // ✅ 선택한 통계 유형에 따라 데이터 변경
  const renderStatistics = () => {
    if (selectedType === "감정별 통계") {
      return (
        <div className="statistics-grid">
          {/* ✅ 첫 번째 줄 - 4개 가로 배치 */}
          <div className="row-1">
            {emotionStats.slice(0, 4).map((stat) => (
              <div key={stat.emotion} className="stats-card">
                <div className="stats-title">
                  <Image
                    src={EMOTION_ICONS[stat.emotion]}
                    alt={stat.emotion}
                    width={25}
                    height={25}
                    className="stats-emoji"
                  />
                  {stat.title}
                </div>
                <div className="movie-list">
                  {stat.movies.map((movie, index) => (
                    <div key={index} className="movie-item">
                      <span className="movie-info">
                        {index + 1}위 {movie}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ✅ 두 번째 줄 - 3개 가로 배치 */}
          <div className="row-2">
            {emotionStats.slice(4, 7).map((stat) => (
              <div key={stat.emotion} className="stats-card">
                <div className="stats-title">
                  <Image
                    src={EMOTION_ICONS[stat.emotion]}
                    alt={stat.emotion}
                    width={25}
                    height={25}
                    className="stats-emoji"
                  />
                  {stat.title}
                </div>
                <div className="movie-list">
                  {stat.movies.map((movie, index) => (
                    <div key={index} className="movie-item">
                      <span className="movie-info">
                        {index + 1}위 {movie}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (selectedType === "개인 통계") {
      return renderChart(
        personalStats.map((stat) => stat.name),
        personalStats.map((stat) => stat.count),
        "개인 감정 사용 횟수"
      );
    } else if (selectedType === "월별 통계") {
      return renderChart(
        monthlyStats.map((stat) => stat.month),
        monthlyStats.map((stat) => stat.count),
        "월별 감정 사용 횟수"
      );
    } else if (selectedType === "전체 통계") {
      return renderChart(
        totalStats.map((stat) => stat.name),
        totalStats.map((stat) => stat.value),
        "전체 감정 사용 횟수"
      );
    }
  };

  return (
    <div className="statistics-container">
      {/* 📅 헤더 */}
      <div className="header">
        {/* ✅ 왼쪽: 날짜 & momo 이미지 */}
        <div className="date-container">
          <Image
            src="/momo.png"
            alt="날짜 아이콘"
            width={80}
            height={80}
            className="date-icon"
          />
          <span>
            {new Date().toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* ✅ 드롭다운 UI 개선 */}
        <div
          className={`dropdown ${dropdownOpen ? "open" : ""}`}
          ref={dropdownRef}
        >
          <button
            className="dropdown-btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {selectedType}
            <span className={`dropdown-icon ${dropdownOpen ? "rotate" : ""}`}>
              ▼
            </span>
          </button>
          {dropdownOpen && (
            <ul className="dropdown-menu">
              {STATISTICS_TYPES.map((type) => (
                <li
                  key={type}
                  onClick={() => {
                    setSelectedType(type);
                    setDropdownOpen(false);
                  }}
                  className={selectedType === type ? "active" : ""}
                >
                  {type}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 🎬 통계 데이터 표시 (드롭다운 선택에 따라 변경됨) */}
      {renderStatistics()}
    </div>
  );
}
