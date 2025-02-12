"use client";

import { useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import styles from "@/styles/Calendar.module.css";

interface CalendarFormProps {
  onDateSelect: (date: Date) => void;
  diaryEntries?: Record<string, any>; // ✅ diaryEntries를 옵셔널로 변경
}

export default function CalendarForm({
  onDateSelect,
  diaryEntries = {},
}: CalendarFormProps) {
  const handleDateChange: CalendarProps["onChange"] = (value) => {
    if (value instanceof Date) {
      console.log("📅 선택한 날짜:", value.toDateString());
      onDateSelect(value);
    }
  };

  return (
    <div className={styles.calendarContainer}>
      <Calendar
        onChange={handleDateChange}
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
          const dateKey = date.toISOString().split("T")[0];

          // ✅ diaryEntries가 undefined이면 빈 객체 `{}`를 사용
          return diaryEntries?.[dateKey] ? styles.highlight : "";
        }}
      />
    </div>
  );
}
