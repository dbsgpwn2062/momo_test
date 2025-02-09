"use client";

import { useState } from "react";
import styles from "@/styles/EmojiPicker.module.css";

interface EmojiPickerProps {
  title: string;
  type: "weather" | "emotion" | "daily" | "activity"; // ✅ 날씨 추가
  onSelect: (emoji: string) => void;
}

// 날씨 이모지 목록
const weatherEmojis = [
  "/weather/cloud.png",
  "/weather/rain.png",
  "/weather/snow.png",
  "/weather/sun.png",
  "/weather/thunder.png",
  "/weather/wind.png",
];

// 감정 이모지 목록
const emotionEmojis = [
  "/emotion/happy.png",
  "/emotion/crying.png",
  "/emotion/confusion.png",
  "/emotion/scared.png",
  "/emotion/shame.png",
  "/emotion/love.png",
  "/emotion/angry.png",
];

// 일상 이모지 목록
const dailyEmojis = [
  "/daily/book.png",
  "/daily/music.png",
  "/daily/meal.png",
  "/daily/shopping.png",
  "/daily/studying.png",
];

// 활동 이모지 목록
const activityEmojis = [
  "/activity/dog-walking.png",
  "/activity/jogging.png",
  "/activity/movie.png",
  "/activity/sports.png",
  "/activity/travel.png",
];

export default function EmojiPicker({
  title,
  type,
  onSelect,
}: EmojiPickerProps) {
  const emojis =
    type === "weather"
      ? weatherEmojis
      : type === "emotion"
      ? emotionEmojis
      : type === "daily"
      ? dailyEmojis
      : activityEmojis;

  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);

  const handleEmojiClick = (emoji: string) => {
    setSelectedEmojis((prev) =>
      prev.includes(emoji) ? prev.filter((e) => e !== emoji) : [...prev, emoji]
    );
    onSelect(emoji);
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
            className={`${
              type === "weather"
                ? styles.emojiImage_weather
                : type === "emotion"
                ? styles.emojiImage_emo
                : type === "daily"
                ? styles.emojiImage_daily
                : styles.emojiImage_activity
            } ${selectedEmojis.includes(emoji) ? styles.selected : ""}`}
            onClick={() => handleEmojiClick(emoji)}
          />
        ))}
      </div>
    </div>
  );
}
