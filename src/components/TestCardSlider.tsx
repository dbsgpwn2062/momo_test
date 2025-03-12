"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const cards = [
  { id: 1, title: "Movie 1", color: "#DADADA" },
  { id: 2, title: "Movie 2", color: "#B0C4DE" },
  { id: 3, title: "Movie 3", color: "#8FBC8F" },
  { id: 4, title: "Movie 4", color: "#D8BFD8" },
  { id: 5, title: "Movie 5", color: "#FFA07A" },
];

export default function TestCardSlider() {
  const [index, setIndex] = useState(0);

  const nextCard = () => {
    setIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div
      className="relative flex items-center justify-center h-96 w-full bg-gray-100"
      onClick={(e) => {
        if (e.clientX > window.innerWidth / 2) {
          nextCard(); // 오른쪽 클릭 → 다음 카드
        } else {
          prevCard(); // 왼쪽 클릭 → 이전 카드
        }
      }}
    >
      {/* 카드 리스트 */}
      <div className="relative w-96 h-80 flex justify-center">
        {cards.map((movie, i) => {
          const position = i - index;

          // ✅ 카드 간격을 더 넓혀 겹치지 않도록 설정
          let xOffset = position * 220; // 카드 간격을 220px로 설정
          let scale = position === 0 ? 1.2 : 0.7; // 중앙 카드 크게, 양옆 작게
          let zIndex = position === 0 ? 10 : 5; // 중앙 카드가 위에 보이도록
          let opacity = Math.abs(position) > 1 ? 0 : 1; // 양옆 한 개씩만 보이게

          return (
            <motion.div
              key={movie.id}
              className="absolute w-48 h-64 flex items-center justify-center text-white font-bold shadow-lg rounded-md"
              style={{
                backgroundColor: movie.color,
              }}
              initial={{ opacity: 0 }}
              animate={{
                x: xOffset,
                scale: scale,
                opacity: opacity,
                zIndex: zIndex,
              }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
            >
              {movie.title}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
