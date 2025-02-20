"use client";

import { useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import dayjs from "dayjs";
import styles from "@/styles/MainForm.module.css";
import { getTokenFromCookies } from "@/services/auth";

interface CalendarFormProps {
  onDateSelect: (date: Date) => void;
  onMonthChange: (year: number, month: number) => void;
  diaryEntries?: Record<string, any>;
}

export default function CalendarForm({
  onDateSelect,
  onMonthChange,
  diaryEntries = {},
}: CalendarFormProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  // ✅ 달 변경 감지 함수
  const handleActiveStartDateChange: CalendarProps["onActiveStartDateChange"] =
    ({ activeStartDate }) => {
      if (activeStartDate) {
        setCurrentMonth(activeStartDate);
        onMonthChange(
          activeStartDate.getFullYear(),
          activeStartDate.getMonth() + 1
        );
      }
    };

  // ✅ 날짜 선택 시 로그인 체크
  const handleDateChange: CalendarProps["onChange"] = async (value) => {
    const token = await getTokenFromCookies();

    if (!token) {
      setShowLoginAlert(true);
      return;
    }

    if (value instanceof Date) {
      onDateSelect(value);
    }
  };

  return (
    <div className={styles.calendarContainer}>
      {" "}
      {/* ✅ 전역 CSS 적용 */}
      <Calendar
        onChange={handleDateChange}
        onActiveStartDateChange={handleActiveStartDateChange} // ✅ 월 변경 감지
        className="react-calendar"
        locale="ko-KR"
        calendarType="gregory"
        showFixedNumberOfWeeks={false}
        formatShortWeekday={(locale, date) =>
          ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][date.getDay()]
        }
        prev2Label={
          <img
            src="/calendar/pre_year.png"
            alt="이전 년"
            width="20"
            height="20"
          />
        }
        prevLabel={
          <img
            src="/calendar/left-arrow.png"
            alt="이전 달"
            width="20"
            height="20"
          />
        }
        nextLabel={
          <img
            src="/calendar/right-arrow.png"
            alt="다음 달"
            width="20"
            height="20"
          />
        }
        next2Label={
          <img
            src="/calendar/next_year.png"
            alt="다음 년"
            width="20"
            height="20"
          />
        }
        formatDay={(locale, date) => date.getDate().toString()}
        tileClassName={({ date }) => {
          const dateKey = dayjs(date).format("YYYY-MM-DD");
          return diaryEntries?.[dateKey] ? "highlight" : ""; // ✅ 작성된 일기 강조 표시
        }}
      />
      {/* 로그인 필요 알림 팝업 */}
      {showLoginAlert && (
        <div
          className={styles.popupOverlay}
          onClick={() => setShowLoginAlert(false)}
        >
          <div
            className={styles.popupContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: "20px" }}>알림</h3>
            <p>로그인이 필요한 서비스입니다.</p>
            <button
              className={styles.popupButton}
              onClick={() => setShowLoginAlert(false)}
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
