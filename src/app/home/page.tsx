"use client";

import { useState, useEffect } from "react";
import CalendarForm from "@/components/mainForm/CalendarForm";
import DiaryForm from "@/components/mainForm/DiaryForm";
import styles from "@/styles/MainForm.module.css";
import dayjs from "dayjs";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function MainPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [diaryData, setDiaryData] = useState<any>(null);
  const [diaryEntries, setDiaryEntries] = useState<Record<string, any>>({});
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);

  // ✅ 특정 날짜의 일기 데이터를 불러오는 함수
  const fetchDiaryData = async (date: Date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD"); // ✅ UTC 문제 해결

    try {
      const idToken = sessionStorage.getItem("idToken");
      if (!idToken) {
        console.warn("⚠️ 로그인 필요");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/home/calendar/detail_read/${formattedDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("📥 GET 요청 성공:", data);
        setDiaryData(data); // ✅ 불러온 데이터를 상태에 저장
        setDiaryEntries((prev) => ({
          ...prev,
          [formattedDate]: data, // ✅ 캘린더에 저장된 날짜 정보 업데이트
        }));
      } else {
        console.warn("⚠️ 해당 날짜의 일기가 없음");
        setDiaryData(null);
      }
    } catch (error) {
      console.error("❌ GET 요청 오류:", error);
      setDiaryData(null);
    }
  };

  // ✅ 다이어리 저장 후, 최신 데이터 반영을 위한 함수
  const handleSaveDiary = async () => {
    if (!selectedDate) return;

    console.log("🔄 저장 후 데이터 갱신");
    await fetchDiaryData(selectedDate); // ✅ 저장 후 GET 요청 다시 실행
  };

  // ✅ 선택한 날짜 변경 시 GET 요청 실행
  useEffect(() => {
    if (selectedDate) {
      fetchDiaryData(selectedDate);
      setIsDiaryOpen(true); // ✅ 다이어리 폼 열기
    }
  }, [selectedDate]);

  return (
    <div className={styles.mainContainer}>
      {/* 캘린더 */}
      <CalendarForm
        onDateSelect={setSelectedDate}
        diaryEntries={diaryEntries} // ✅ 저장된 날짜 하이라이트 유지
      />

      {/* 다이어리 폼 (선택된 날짜가 있을 때만 렌더링) */}
      {isDiaryOpen && selectedDate !== null && (
        <DiaryForm
          date={selectedDate}
          diaryData={diaryData}
          onClose={() => setIsDiaryOpen(false)}
          onSave={handleSaveDiary} // ✅ 저장 후 데이터 갱신
        />
      )}
    </div>
  );
}
