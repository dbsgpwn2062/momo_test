"use client";
import Image from "next/image";

const emotions = [
  { name: "행복한", icon: "/emotion/happy.png" },
  { name: "설레는", icon: "/emotion/love.png" },
  { name: "화나는", icon: "/emotion/angry.png" },
  { name: "슬픈", icon: "/emotion/crying.png" },
  { name: "혼란스러운", icon: "/emotion/confusion.png" },
  { name: "무서운", icon: "/emotion/scared.png" },
  { name: "부끄러운", icon: "/emotion/shame.png" },
];

export default function StatisticsCard({
  title,
  movies,
}: {
  title: string;
  movies: string[];
}) {
  const emotion = emotions.find((e) => title.includes(e.name));

  return (
    <div className="stats-card">
      <h3 className="stats-title">
        {emotion && (
          <Image
            src={emotion.icon}
            alt={title}
            width={30}
            height={30}
            className="stats-emoji"
          />
        )}
        {title} 콘텐츠 순위
      </h3>
      <div className="movie-list">
        {movies.map((movie, index) => (
          <div key={index} className="movie-item">
            <span>{index + 1}위</span>
            <span className="movie-info">{movie}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
