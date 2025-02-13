"use client";

import { useState, useEffect } from "react";
import CalendarForm from "@/components/mainForm/CalendarForm";
import DiaryForm from "@/components/mainForm/DiaryForm";
import ReadDiary from "@/components/mainForm/ReadDiary";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/mainForm/ChartForm";
import SearchBar from "@/components/ui/SearchBar"; // ✅ 검색바 추가
import styles from "@/styles/MainForm.module.css";
import dayjs from "dayjs";
import { fetchDiaryData, fetchMonthData } from "@/services/calendar";

export default function MainPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [diaryData, setDiaryData] = useState<any>(null);
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [diaryEntries, setDiaryEntries] = useState<Record<string, boolean>>({});
  const [currentMonth, setCurrentMonth] = useState(new Date()); // ✅ 현재 보고 있는 월 상태 저장

  // ✅ 특정 날짜의 일기 데이터를 불러오는 함수
  useEffect(() => {
    if (selectedDate) {
      fetchDiaryData(dayjs(selectedDate).format("YYYY-MM-DD")).then((data) => {
        setDiaryData(data);
        setIsDiaryOpen(true); // ✅ 선택한 날짜에 따라 다이어리 폼 열기
      });
    }
  }, [selectedDate]);

  // ✅ 현재 보고 있는 월의 데이터를 가져오는 함수
  const loadMonthData = async (year: number, month: number) => {
    try {
      const data = await fetchMonthData(year, month);
      if (data?.written_dates) {
        const newEntries: Record<string, boolean> = {};
        data.written_dates.forEach((date: string) => (newEntries[date] = true));
        setDiaryEntries(newEntries);
      }
    } catch (error) {
      console.error("❌ 월별 데이터를 가져오는 데 실패했습니다:", error);
    }
  };

  // ✅ 새로고침했을 때 현재 보고 있는 월 데이터 유지
  useEffect(() => {
    loadMonthData(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
  }, []);

  // ✅ 월이 변경될 때마다 데이터 다시 불러오기
  const handleMonthChange = (year: number, month: number) => {
    setCurrentMonth(new Date(year, month - 1));
    loadMonthData(year, month);
  };

  // ✅ 일기 저장 후 최신 데이터 반영 (캘린더에도 즉시 업데이트)
  const handleSaveDiary = async () => {
    if (!selectedDate) return;

    await fetchDiaryData(dayjs(selectedDate).format("YYYY-MM-DD")).then(
      setDiaryData
    );
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    await loadMonthData(year, month);
  };

  return (
    <div className={styles.mainContainer}>
      {/* ✅ 헤더 추가 (고정) */}
      <Header />

      <div className={styles.contentWrapper}>
        {/* 캘린더 */}
        <CalendarForm
          onDateSelect={setSelectedDate}
          onMonthChange={handleMonthChange} // ✅ 월 변경 시 데이터 로드
          diaryEntries={diaryEntries}
        />

        {/* ✅ 사이드바 (검색바 추가) */}
        <div className={styles.sidebarContainer}>
          <SearchBar /> {/* ✅ 검색바 추가 */}
          <Sidebar />
        </div>
      </div>

      {/* ✅ 일기 폼 또는 읽기 전용 일기 */}
      {isDiaryOpen &&
        selectedDate !== null &&
        (diaryData ? (
          <ReadDiary
            diaryData={diaryData}
            onClose={() => setIsDiaryOpen(false)}
          />
        ) : (
          <DiaryForm
            date={selectedDate}
            diaryData={diaryData}
            onClose={() => setIsDiaryOpen(false)}
            onSave={handleSaveDiary}
          />
        ))}
    </div>
  );
}
