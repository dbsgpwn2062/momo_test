"use client";

import styles from "@/styles/ReadOnlyDiary.module.css";

interface ReadOnlyDiaryProps {
  diaryData: any;
  onClose: () => void;
}

export default function ReadOnlyDiary({
  diaryData,
  onClose,
}: ReadOnlyDiaryProps) {
  return (
    <div className={`${styles.diaryPanel} ${styles.open}`}>
      <button className={styles.closeButton} onClick={onClose}>
        ✖ 닫기
      </button>
      <h2>{diaryData.date}</h2>

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
        <strong>일기 내용:</strong>
      </p>
      <div className={styles.diaryContent}>
        {diaryData.diary || "일기 내용 없음"}
      </div>
    </div>
  );
}
