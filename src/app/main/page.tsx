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

  const handleSaveDiary = (date: Date, content: string) => {
    setDiaryEntries((prev) => ({
      ...prev,
      [date.toDateString()]: content,
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
          onSave={handleSaveDiary}
          onClose={() => setIsDiaryOpen(false)}
        />
      )}
    </div>
  );
}
