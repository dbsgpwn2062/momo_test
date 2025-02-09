"use client";

import { useState, useEffect } from "react";
import styles from "@/styles/DiaryForm.module.css";

interface DiaryFormProps {
  date: Date | null;
  onSave: (date: Date, content: string) => void;
  onClose: () => void;
}

export default function DiaryForm({ date, onSave, onClose }: DiaryFormProps) {
  const [diary, setDiary] = useState("");

  useEffect(() => {
    setDiary(""); // 날짜 변경 시 초기화
  }, [date]);

  if (!date) return null; // 선택된 날짜 없으면 안 보이게 함

  return (
    <div className={`${styles.diaryPanel} ${styles.open}`}>
      <button className={styles.closeButton} onClick={onClose}>
        ✖ 닫기
      </button>
      <h2>{date.toDateString()} 일기</h2>
      <textarea
        value={diary}
        onChange={(e) => setDiary(e.target.value)}
        placeholder="오늘의 일기를 작성하세요..."
        className={styles.textarea}
      />
      <button onClick={() => onSave(date, diary)} className={styles.button}>
        저장
      </button>
    </div>
  );
}
