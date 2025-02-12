"use client";

import styles from "@/styles/DiaryForm.module.css";

interface ReadDiaryProps {
  diaryData: any;
  onClose: () => void;
}

export default function ReadDiary({ diaryData, onClose }: ReadDiaryProps) {
  return (
    <div className={`${styles.diaryPanel} ${styles.open}`}>
      <button className={styles.closeButton} onClick={onClose}>
        ✖ 닫기
      </button>
      <h2>{diaryData.date} 기록된 일기</h2>

      <p>
        <strong>날씨:</strong> {diaryData.emoticons?.weather || "정보 없음"}
      </p>
      <p>
        <strong>기분:</strong>{" "}
        {diaryData.emoticons?.emotion?.join(", ") || "정보 없음"}
      </p>
      <p>
        <strong>일상:</strong>{" "}
        {diaryData.emoticons?.daily?.join(", ") || "정보 없음"}
      </p>
      <p>
        <strong>활동:</strong>{" "}
        {diaryData.emoticons?.activity?.join(", ") || "정보 없음"}
      </p>
      <p>
        <strong>내용:</strong> {diaryData.diary || "기록 없음"}
      </p>
    </div>
  );
}
