"use client";

import { useState, useEffect } from "react";
import CalendarForm from "@/components/mainForm/CalendarForm";
import DiaryForm from "@/components/mainForm/DiaryForm";
import ReadDiary from "@/components/mainForm/ReadDiary";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/mainForm/ChartForm";
import SearchBar from "@/components/ui/SearchBar";
import styles from "@/styles/MainForm.module.css";
import dayjs from "dayjs";
import { fetchDiaryData, fetchMonthData } from "@/services/calendar";

export default function MainPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [diaryData, setDiaryData] = useState<any>(null);
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [diaryEntries, setDiaryEntries] = useState<Record<string, boolean>>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // ✅ 특정 날짜의 일기 데이터를 불러오는 함수
  useEffect(() => {
    if (selectedDate) {
      fetchDiaryData(dayjs(selectedDate).format("YYYY-MM-DD"))
        .then((data) => {
          setDiaryData(data);
          setIsDiaryOpen(true);
        })
        .catch((error) => {
          console.error("❌ 일기 데이터를 불러오는 데 실패:", error);
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

  // ✅ 삭제 후 UI 즉시 반영 및 서버 동기화
  const handleDeleteDiary = async (date: string) => {
    console.log(`[DELETE] 🗑 일기 삭제 요청됨: ${date}`);

    // ✅ 삭제 전에 백업 (실패 시 롤백용)
    const prevEntries = { ...diaryEntries };

    // ✅ UI에서 즉시 반영
    setDiaryEntries((prev) => {
      const newEntries = { ...prev };
      if (newEntries[date]) {
        console.log(`[DELETE] 🔄 캘린더에서 즉시 제거: ${date}`);
        delete newEntries[date];
      }
      return newEntries;
    });

    // ✅ 다이어리 창 닫기 (삭제된 데이터 다시 불러오지 않도록)
    setSelectedDate(null);
    setIsDiaryOpen(false);

    try {
      const res = await fetch(`/api/diary?date=${date}`, { method: "DELETE" });

      if (res.status === 404) {
        console.warn(`[DELETE] ❗ 이미 삭제된 일기입니다: ${date}`);
      } else if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "삭제 실패");
      }

      console.log("[DELETE] ✅ 서버에서도 삭제 성공!");

      // ✅ 최신 월별 데이터 다시 불러오기
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      await loadMonthData(year, month);
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("일기 삭제 중 오류가 발생했습니다.");

      // ✅ 삭제 실패 시 원래 상태로 롤백
      setDiaryEntries(prevEntries);
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

  // ✅ 일기 저장 후 최신 데이터 반영
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
      {/* ✅ 헤더 */}
      <Header />

      <div className={styles.contentWrapper}>
        {/* ✅ 캘린더 */}
        <CalendarForm
          onDateSelect={setSelectedDate}
          onMonthChange={handleMonthChange}
          diaryEntries={diaryEntries}
        />

        {/* ✅ 사이드바 */}
        <div className={styles.sidebarContainer}>
          <SearchBar />
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
            onDeleteSuccess={handleDeleteDiary}
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
