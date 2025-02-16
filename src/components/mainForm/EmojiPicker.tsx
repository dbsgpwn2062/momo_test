"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/EmojiPicker.module.css";

interface EmojiPickerProps {
  title: string;
  type: "weather" | "emotion" | "daily" | "activity";
  selected: string | string[];
  onSelect: (emoji: string) => void;
  resetTrigger: number;
}

// ✅ **이모지 목록 정의 (활동 카테고리 변경됨)**
const emojiData = {
  weather: [
    "/weather/sun.png",
    "/weather/cloud.png",
    "/weather/wind.png",
    "/weather/rain.png",
    "/weather/snow.png",
    "/weather/thunder.png",
  ],
  emotion: [
    "/emotion/joy.png",
    "/emotion/happy.png",
    "/emotion/satisfaction.png",
    "/emotion/exciting.png",
    "/emotion/love.png",
    "/emotion/frustration.png",
    "/emotion/annoyance.png",
    "/emotion/surprise.png",
    "/emotion/anxiety.png",
    "/emotion/neutral.png",
    "/emotion/sadness.png",
    "/emotion/gloom.png",
  ],
  daily: [
    "/daily/coffee.png",
    "/daily/meal.png",
    "/daily/music.png",
    "/daily/rest.png",
    "/daily/study.png",
    "/daily/walk.png",
    "/daily/win.png",
    "/daily/work.png",
    "/daily/dog.png",
    "/daily/cat.png",
  ],
  activity: [
    "/activity/drawing.png",
    "/activity/game.png",
    "/activity/soccer.png",
    "/activity/baseball.png",
    "/activity/golf.png",
    "/activity/movie.png",
    "/activity/sing.png",
    "/activity/bicycle.png",
    "/activity/swim.png",
    "/activity/travel.png",
    "/activity/winter_activity.png",
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

  useEffect(() => {
    setLocalSelected(type === "weather" ? "" : []);
  }, [resetTrigger]);

  const handleEmojiClick = (emoji: string) => {
    if (type === "weather") {
      setLocalSelected((prev) => (prev === emoji ? "" : emoji));
      setTimeout(() => onSelect(emoji === selected ? "" : emoji), 0);
    } else {
      setLocalSelected((prev) => {
        const prevArray = Array.isArray(prev)
          ? prev
          : prev.split(",").filter(Boolean);
        const newState = prevArray.includes(emoji)
          ? prevArray.filter((e) => e !== emoji)
          : [...prevArray, emoji];

        setTimeout(() => onSelect(newState.join(",")), 0);
        return newState;
      });
    }
  };

  return (
    <div className={styles.emojiPicker}>
      <h3 className={styles.emojiTitle}>{title}</h3>
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
