"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/DiaryForm.module.css";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import EmojiPicker from "@/components/mainForm/EmojiPicker";

interface DiaryFormProps {
  date: Date | null;
  onSave: (
    date: Date,
    content: string,
    selectedWeather: string[],
    selectedEmojis: string[],
    selectedActivities: string[]
  ) => void;
  onClose: () => void;
}

export default function DiaryForm({ date, onSave, onClose }: DiaryFormProps) {
  const [diary, setDiary] = useState("");
  const [selectedWeather, setSelectedWeather] = useState<string[]>([]); // ✅ 날씨 선택 추가
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const formattedDate = dayjs(date).locale("ko").format("YYYY년 M월 D일 dddd");

  useEffect(() => {
    setDiary("");
    setSelectedWeather([]);
    setSelectedEmojis([]);
    setSelectedActivities([]);
  }, [date]);

  if (!date) return null;

  return (
    <div className={`${styles.diaryPanel} ${styles.open}`}>
      <button className={styles.closeButton} onClick={onClose}>
        ✖ 닫기
      </button>
      <h2>{formattedDate}</h2>

      {/* ✅ 날씨 선택 추가 (감정 선택 위에 배치) */}
      <EmojiPicker
        title="날씨"
        type="weather"
        onSelect={(emoji) => setSelectedWeather([emoji])}
      />

      {/* ✅ 감정 선택 */}
      <EmojiPicker
        title="기분"
        type="emotion"
        onSelect={(emoji) => setSelectedEmojis((prev) => [...prev, emoji])}
      />

      {/* ✅ 일상 선택 */}
      <EmojiPicker
        title="일상"
        type="daily"
        onSelect={(emoji) => setSelectedEmojis((prev) => [...prev, emoji])}
      />

      {/* ✅ 활동 선택 */}
      <EmojiPicker
        title="활동"
        type="activity"
        onSelect={(emoji) => setSelectedActivities((prev) => [...prev, emoji])}
      />

      <textarea
        value={diary}
        onChange={(e) => setDiary(e.target.value)}
        placeholder="오늘의 일기를 작성하세요..."
        className={styles.textarea}
      />
      <button
        onClick={() =>
          onSave(
            date,
            diary,
            selectedWeather,
            selectedEmojis,
            selectedActivities
          )
        }
        className={styles.button}
      >
        저장
      </button>
    </div>
  );
}
