"use client";

import { useState } from "react";
import CalendarForm from "@/components/mainForm/CalendarForm";
import DiaryForm from "@/components/mainForm/DiaryForm";
import Chatbot from "@/components/mainForm/chatbot/Chatbot"; // ✅ 챗봇 컴포넌트 추가
import styles from "@/styles/MainForm.module.css";
import Image from "next/image";

export default function MainPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [diaryEntries, setDiaryEntries] = useState<Record<string, string>>({});
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsDiaryOpen(true);
  };

  const handleSaveDiary = (data: { date?: Date; content: string }) => {
    if (!data.date) {
      console.error("⚠️ handleSaveDiary에서 date가 undefined입니다.");
      return;
    }

    setDiaryEntries((prev) => ({
      ...prev,
      [data.date?.toDateString() || "날짜 없음"]: data.content,
    }));
    setIsDiaryOpen(false);
  };

  return (
    <div className={styles.mainContainer}>
      {/* 📅 캘린더 폼 */}
      <CalendarForm onDateSelect={handleDateSelect} />

      {/* 📖 다이어리 폼 */}
      {isDiaryOpen && selectedDate && (
        <DiaryForm
          date={selectedDate}
          onSave={handleSaveDiary}
          onClose={() => setIsDiaryOpen(false)}
        />
      )}

      {/* ✅ momo.png 버튼 (말풍선) */}
<button className={styles.chatbotButton} onClick={() => setIsChatbotOpen(true)}>
  <div className={styles.chatbotBubble}>
    <div className={styles.chatbotTail}></div> {/* ✅ 말풍선 꼬리 추가 */}
    <Image src="/momo.png" alt="Chatbot" width={50} height={50} />
  </div>
  <span className={styles.chatbotText}>momo chat</span>
</button>

      {/* ✅ 챗봇 팝업 (momo 스타일 적용) */}
      {isChatbotOpen && (
        <div className={styles.chatbotOverlay} onClick={() => setIsChatbotOpen(false)}>
          <div className={styles.chatbotPopup} onClick={(e) => e.stopPropagation()}>
            <Chatbot onClose={() => setIsChatbotOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
