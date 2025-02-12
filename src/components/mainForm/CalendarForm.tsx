"use client";

import { useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import styles from "@/styles/Calendar.module.css";
import dayjs from "dayjs";

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
      <Calendar
        onChange={handleDateChange}
        onActiveStartDateChange={handleActiveStartDateChange}
        className={styles.reactCalendar}
        locale="ko-KR"
        calendarType="gregory"
        formatShortWeekday={(locale, date) =>
          ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][date.getDay()]
        }
        prev2Label="≪"
        prevLabel="＜"
        nextLabel="＞"
        next2Label="≫"
        formatDay={(locale, date) => date.getDate().toString()}
        tileClassName={({ date }) => {
          const dateKey = dayjs(date).format("YYYY-MM-DD");
          return diaryEntries?.[dateKey] ? styles.highlight : ""; // ✅ 작성 완료된 날짜만 강조
        }}
      />
    </div>
  );
}
