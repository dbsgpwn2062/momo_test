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

  // ✅ 수정된 `handleSaveDiary` (data 객체 하나를 받음)
  const handleSaveDiary = (data: { date: Date; content: string }) => {
    setDiaryEntries((prev) => ({
      ...prev,
      [data.date.toDateString()]: data.content,
    }));
    setIsDiaryOpen(false); // 저장 후 창 닫기
  };

  return (
    <div className={styles.mainContainer}>
      {/* 캘린더 폼 */}
      <CalendarForm onDateSelect={handleDateSelect} />

      {/* 다이어리 폼 */}
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
