"use client";

import { useState } from "react";
import Calendar, { CalendarProps } from "react-calendar";
import styles from "@/styles/Calendar.module.css";

interface CalendarFormProps {
  onDateSelect: (date: Date) => void; // 메인에서 상태 관리
}

export default function CalendarForm({ onDateSelect }: CalendarFormProps) {
  const handleDateChange: CalendarProps["onChange"] = (value) => {
    if (value instanceof Date) {
      console.log("📅 선택한 날짜:", value.toDateString());
      onDateSelect(value); // 부모 컴포넌트(메인)로 날짜 전달
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
      />
    </div>
  );
}
