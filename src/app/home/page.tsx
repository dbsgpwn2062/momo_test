"use client";

import { useState } from "react";
import CalendarForm from "@/components/mainForm/CalendarForm";
import DiaryForm from "@/components/mainForm/DiaryForm";
import styles from "@/styles/MainForm.module.css";

export default function MainPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [diaryEntries, setDiaryEntries] = useState<Record<string, string>>({});
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsDiaryOpen(true);
  };

  // ✅ `date`가 undefined일 가능성 대비 (TypeScript 오류 해결)
  const handleSaveDiary = (data: { date?: Date; content: string }) => {
    if (!data.date) {
      console.error("⚠️ handleSaveDiary에서 date가 undefined입니다.");
      return; // ✅ date가 undefined면 실행하지 않음
    }

    setDiaryEntries((prev) => ({
      ...prev,
      [data.date?.toDateString() || "날짜 없음"]: data.content, // ✅ date가 null이면 "날짜 없음" 키 사용
    }));
    setIsDiaryOpen(false);
  };

  return (
    <div className={styles.mainContainer}>
      {/* 캘린더 폼 */}
      <CalendarForm onDateSelect={handleDateSelect} />

      {/* 다이어리 폼 (selectedDate가 null이면 렌더링하지 않음) */}
      {isDiaryOpen && selectedDate && (
        <DiaryForm
          date={selectedDate}
          onSave={handleSaveDiary} // ✅ 수정된 onSave 적용
          onClose={() => setIsDiaryOpen(false)}
        />
      )}
    </div>
  );
}
