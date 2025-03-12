"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import styles from "@/styles/TopMovies.module.css";

interface Movie {
  title: string;
  poster_url: string;
}

interface TopMoviesProps {
  movies: Movie[];
  mbtiType: string;
}

export function TopMovies({ movies, mbtiType }: TopMoviesProps) {
  const [index, setIndex] = useState(0);

  if (movies.length === 0) {
    return <p className="text-center text-gray-500">추천 영화가 없습니다.</p>;
  }

  const nextCard = () => {
    setIndex((prev) => (prev + 1) % movies.length);
  };

  const prevCard = () => {
    setIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  return (
    <div
      className={styles.container}
      onClick={(e) => {
        if (e.clientX > window.innerWidth / 2) {
          nextCard();
        } else {
          prevCard();
        }
      }}
    >
      <h2 className={styles.title}>오늘 {mbtiType}의 추천 영화 순위</h2>

      <div className={styles.cardContainer}>
        {movies.map((movie, i) => {
          const position = i - index;
          let xOffset = position * 220;
          let scale = position === 0 ? 1.2 : 0.7;
          let zIndex = position === 0 ? 10 : 5;
          let opacity = Math.abs(position) > 1 ? 0 : 1;

          return (
            <motion.div
              key={movie.title}
              className={styles.movieCard}
              style={{
                backgroundImage: `url(${movie.poster_url})`,
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
              <div className={styles.movieTitle}>{movie.title}</div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
