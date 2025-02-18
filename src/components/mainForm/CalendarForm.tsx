"use client";

import { useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import dayjs from "dayjs";
import styles from "@/styles/MainForm.module.css";

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

  const handleDateChange: CalendarProps["onChange"] = (value) => {
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
    </div>
  );
}
