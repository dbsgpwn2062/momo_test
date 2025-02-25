"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import CalendarForm from "@/components/mainForm/CalendarForm";
import DiaryForm from "@/components/mainForm/DiaryForm";
import ReadDiary from "@/components/mainForm/ReadDiary";
import Header from "@/components/ui/Header";
import Sidebar from "@/components/mainForm/ChartForm";
import SearchBar from "@/components/ui/SearchBar";
import Chatbot from "@/components/mainForm/Chatbot";
import styles from "@/styles/MainForm.module.css";
import "@/styles/chatbot.css";
import dayjs from "dayjs";
import { fetchDiaryData, fetchMonthData } from "@/services/calendar";
import { getTokenFromCookies, setUserInfoCookie } from "@/services/auth";

export default function MainPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [diaryData, setDiaryData] = useState<any>(null);
  const [isDiaryOpen, setIsDiaryOpen] = useState(false);
  const [diaryEntries, setDiaryEntries] = useState<Record<string, boolean>>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showFutureAlert, setShowFutureAlert] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
      let idToken = await getTokenFromCookies();

      if (!idToken) {
        console.warn("⚠️ [loadMonthData] idToken 없음, 1초 후 재시도...");
        setTimeout(() => loadMonthData(year, month), 1000);
        return;
      }

      console.log("✅ [loadMonthData] idToken 확인됨:", idToken);

      const data = await fetchMonthData(year, month);
      if (data?.written_dates) {
        const newEntries: Record<string, boolean> = {};
        data.written_dates.forEach((date: string) => (newEntries[date] = true));
        setDiaryEntries(newEntries);
      }
    } catch (error) {
      console.error("❌ 월별 데이터를 가져오는 데 실패:", error);
    }
  };

  // ✅ 로그인 직후 idToken 반영 후 API 요청 실행
  useEffect(() => {
    const fetchInitialData = async () => {
      console.log("🚀 [fetchInitialData] 로그인 후 idToken 저장 시작...");

      await setUserInfoCookie(); // ✅ 로그인 후 사용자 정보 저장
      let idToken = await getTokenFromCookies();

      if (!idToken) {
        console.error("❌ [fetchInitialData] idToken 저장 실패! 쿠키에 없음.");
        return;
      }

      console.log("✅ [fetchInitialData] idToken 저장 완료:", idToken);

      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      await loadMonthData(year, month); // ✅ 쿠키 저장 후 월별 데이터 불러오기
    };

    fetchInitialData();
  }, []);

  // ✅ 삭제 후 UI 즉시 반영 및 서버 동기화
  const handleDeleteDiary = async (date: string) => {
    console.log(`🗑 일기 삭제 요청됨: ${date}`);

    const prevEntries = { ...diaryEntries };

    setDiaryEntries((prev) => {
      const newEntries = { ...prev };
      if (newEntries[date]) {
        console.log(`🔄 캘린더에서 즉시 제거: ${date}`);
        delete newEntries[date];
      }
      return newEntries;
    });

    setSelectedDate(null);
    setIsDiaryOpen(false);

    try {
      const res = await fetch(`/api/diary?date=${date}`, { method: "DELETE" });
      if (res.status === 404) {
        console.warn(`⚠️ 이미 삭제된 일기입니다: ${date}`);
      } else if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "삭제 실패");
      }

      console.log("✅ 서버에서도 삭제 성공!");
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      await loadMonthData(year, month);
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("일기 삭제 중 오류가 발생했습니다.");
      setDiaryEntries(prevEntries);
    }
  };

  // ✅ 월 변경 처리 함수
  const handleMonthChange = (year: number, month: number) => {
    setCurrentMonth(new Date(year, month - 1));
    loadMonthData(year, month);
  };

  // ✅ 다이어리 저장 처리 함수
  const handleSaveDiary = async () => {
    if (!selectedDate) return;

    await fetchDiaryData(dayjs(selectedDate).format("YYYY-MM-DD")).then(
      setDiaryData
    );

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    await loadMonthData(year, month);
  };

  // ✅ 추천 콘텐츠 저장 후 다이어리 데이터 새로고침
  const handleRecommendationSave = async () => {
    if (selectedDate) {
      try {
        const data = await fetchDiaryData(
          dayjs(selectedDate).format("YYYY-MM-DD")
        );
        setDiaryData(data);
      } catch (error) {
        console.error("다이어리 데이터 새로고침 실패:", error);
      }
    }
  };

  // ✅ 날짜 선택 처리 함수 수정
  const handleDateSelect = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 시간 제거하고 날짜만 비교

    if (date > today) {
      setShowFutureAlert(true); // 미래 날짜 선택 시 알림 표시
      return;
    }

    setSelectedDate(date);
    fetchDiaryData(dayjs(date).format("YYYY-MM-DD"))
      .then((data) => {
        setDiaryData(data);
        setIsDiaryOpen(true);
      })
      .catch((error) => {
        console.error("❌ 일기 데이터를 불러오는 데 실패:", error);
      });
  };

  return (
    <div className={styles.mainContainer}>
      <Header />
      <div className={styles.contentWrapper}>
        <CalendarForm
          onDateSelect={handleDateSelect}
          onMonthChange={handleMonthChange}
          diaryEntries={diaryEntries}
        />
        <div className={styles.sidebarContainer}>
          <SearchBar />
          <Sidebar />
        </div>
      </div>

      {/* ✅ momo 챗봇 버튼 (우측 하단) */}
      {isClient && (
        <button
          className={styles.chatbotButton}
          onClick={(e) => {
            e.stopPropagation();
            setIsChatbotOpen(true);
          }}
        >
          <div className={styles.chatbotBubble}>
            <div className={styles.chatbotTail}></div>
          </div>
          <span className={styles.chatbotText}>momo chat</span>
        </button>
      )}

      {/* ✅ momo 챗봇 팝업 */}
      {isClient && isChatbotOpen && (
        <div
          className={styles.chatbotOverlay}
          onClick={() => setIsChatbotOpen(false)}
        >
          <div
            className={styles.chatbotPopup}
            onClick={(e) => e.stopPropagation()}
          >
            <Chatbot onClose={() => setIsChatbotOpen(false)} />
          </div>
        </div>
      )}

      {/* ✅ 일기 폼 or 읽기 전용 일기 */}
      {isDiaryOpen &&
        selectedDate !== null &&
        (diaryData ? (
          <ReadDiary
            diaryData={diaryData}
            onClose={() => setIsDiaryOpen(false)}
            onDeleteSuccess={handleDeleteDiary}
            onRecommendationSave={handleRecommendationSave}
          />
        ) : (
          <DiaryForm
            date={selectedDate}
            diaryData={diaryData}
            onClose={() => setIsDiaryOpen(false)}
            onSave={handleSaveDiary}
          />
        ))}

      {/* ✅ 미래 날짜 선택 알림 팝업 */}
      {showFutureAlert && (
        <div
          className={styles.popupOverlay}
          onClick={() => setShowFutureAlert(false)}
        >
          <div
            className={styles.popupContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: "20px" }}>알림</h3>
            <p>미래의 일기는 작성할 수 없어요!</p>
            <button
              className={styles.popupButton}
              onClick={() => setShowFutureAlert(false)}
              style={{ marginTop: "20px" }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
