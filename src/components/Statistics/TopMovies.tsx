"use client";

import React from "react";
import styles from "@/styles/TopMovies.module.css"; // CSS 모듈 임포트

interface Movie {
  poster_url: string;
  title: string;
}

interface TopMoviesProps {
  movies: Movie[];
  mbtiType: string;
}

export function TopMovies({ movies, mbtiType }: TopMoviesProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>
        오늘 {mbtiType}의 추천 영화 순위
      </h2>
      <div className="flex gap-4 overflow-x-auto p-4">
        {movies.map((movie, index) => (
          <div key={index} className={styles.movieCard}>
            <img
              src={movie.poster_url}
              alt={movie.title}
              className={styles.movieImage}
            />
            <p className={styles.movieTitle}>{movie.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}