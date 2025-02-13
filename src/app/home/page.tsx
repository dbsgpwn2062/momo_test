"use client";

import { useState, useEffect } from "react";
import CalendarForm from "@/components/mainForm/CalendarForm";
import DiaryForm from "@/components/mainForm/DiaryForm";
import ReadDiary from "@/components/mainForm/ReadDiary";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/mainForm/chart";
import SearchBar from "@/components/ui/SearchBar"; // ✅ 검색바 추가
import styles from "@/styles/MainForm.module.css";
import dayjs from "dayjs";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function MainPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [diaryData, setDiaryData] = useState<any>(null);
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [diaryEntries, setDiaryEntries] = useState<Record<string, boolean>>({});

  // ✅ 특정 날짜의 일기 데이터를 불러오는 함수
  const fetchDiaryData = async (date: Date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");

    try {
      const idToken = sessionStorage.getItem("idToken");
      if (!idToken) return;

      const response = await fetch(
        `${API_BASE_URL}/home/calendar/detail_read/${formattedDate}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDiaryData(data);
      } else {
        setDiaryData(null);
      }
    } catch (error) {
      setDiaryData(null);
    }
  };

  // ✅ 월별 데이터 GET 요청 함수 (캘린더에 표시할 데이터)
  const fetchMonthData = async (year: number, month: number) => {
    try {
      const idToken = sessionStorage.getItem("idToken");
      if (!idToken) return;

      const response = await fetch(
        `${API_BASE_URL}/home/calendar/monthread/${year}-${month
          .toString()
          .padStart(2, "0")}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${idToken}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const newDiaryEntries: Record<string, boolean> = {};
        data.written_dates.forEach((date: string) => {
          newDiaryEntries[date] = true;
        });
        setDiaryEntries(newDiaryEntries);
      } else {
        setDiaryEntries({});
      }
    } catch (error) {
      setDiaryEntries({});
    }
  };

  // ✅ 선택한 날짜 변경 시 GET 요청 실행
  useEffect(() => {
    if (selectedDate) {
      fetchDiaryData(selectedDate);
      setIsDiaryOpen(true);
    }
  }, [selectedDate]);

  // ✅ 처음 페이지 로드 시 현재 연도와 월 GET 요청 실행
  useEffect(() => {
    const today = new Date();
    fetchMonthData(today.getFullYear(), today.getMonth() + 1);
  }, []);

  // ✅ 일기 저장 후 최신 데이터 반영 (캘린더에도 즉시 업데이트)
  const handleSaveDiary = async () => {
    if (!selectedDate) return;

    await fetchDiaryData(selectedDate);
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    await fetchMonthData(year, month);
  };

  return (
    <div className={styles.mainContainer}>
      {/* ✅ 헤더 추가 (고정) */}
      <Header />

      <div className={styles.contentWrapper}>
        {/* 캘린더 */}
        <CalendarForm
          onDateSelect={setSelectedDate}
          onMonthChange={fetchMonthData}
          diaryEntries={diaryEntries}
        />

        {/* ✅ 사이드바 (검색바 추가) */}
        <div className={styles.sidebarContainer}>
          <SearchBar /> {/* ✅ 검색바 추가 */}
          <Sidebar />
        </div>
      </div>

      {/* 일기 폼 또는 읽기 전용 일기 */}
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
