"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/EmojiPicker.module.css";

interface EmojiPickerProps {
  title: string;
  type: "weather" | "emotion" | "daily" | "activity";
  selected: string | string[]; // ✅ 배열도 허용
  onSelect: (emoji: string) => void;
  resetTrigger: number;
}

// ✅ 이모지 목록 정의
const emojiData = {
  weather: [
    "/weather/cloud.png",
    "/weather/rain.png",
    "/weather/snow.png",
    "/weather/sun.png",
    "/weather/thunder.png",
    "/weather/wind.png",
  ],
  emotion: [
    "/emotion/happy.png",
    "/emotion/crying.png",
    "/emotion/confusion.png",
    "/emotion/scared.png",
    "/emotion/shame.png",
    "/emotion/love.png",
    "/emotion/angry.png",
  ],
  daily: [
    "/daily/book.png",
    "/daily/music.png",
    "/daily/meal.png",
    "/daily/shopping.png",
    "/daily/studying.png",
  ],
  activity: [
    "/activity/dog-walking.png",
    "/activity/jogging.png",
    "/activity/movie.png",
    "/activity/sports.png",
    "/activity/travel.png",
  ],
};

export default function EmojiPicker({
  title,
  type,
  selected,
  onSelect,
  resetTrigger,
}: EmojiPickerProps) {
  const emojis = emojiData[type];
  const [localSelected, setLocalSelected] = useState<string | string[]>(
    selected
  );

  // ✅ 날짜 변경 시 선택 초기화
  useEffect(() => {
    setLocalSelected(type === "weather" ? "" : []);
  }, [resetTrigger]);

  const handleEmojiClick = (emoji: string) => {
    if (type === "weather") {
      setLocalSelected((prev) => (prev === emoji ? "" : emoji));
      setTimeout(() => onSelect(emoji === selected ? "" : emoji), 0); // ✅ 비동기 처리
    } else {
      setLocalSelected((prev) => {
        const prevArray = Array.isArray(prev)
          ? prev
          : prev.split(",").filter(Boolean);
        const newState = prevArray.includes(emoji)
          ? prevArray.filter((e) => e !== emoji) // 제거
          : [...prevArray, emoji]; // 추가

        setTimeout(() => onSelect(newState.join(",")), 0); // ✅ 비동기 처리
        return newState;
      });
    }
  };

  return (
    <div className={styles.emojiPicker}>
      <h3>{title}</h3>
      <div className={styles.emojiList}>
        {emojis.map((emoji) => (
          <img
            key={emoji}
            src={emoji}
            alt="이모지"
            className={`${styles.emojiImage} ${
              (Array.isArray(selected)
                ? selected
                : selected.split(",")
              ).includes(emoji)
                ? styles.selected
                : ""
            }`}
            onClick={() => handleEmojiClick(emoji)}
          />
        ))}
      </div>
    </div>
  );
}
