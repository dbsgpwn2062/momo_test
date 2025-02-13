"use client";

import styles from "@/styles/DiaryForm.module.css";
import { useState } from "react";

interface ReadDiaryProps {
  diaryData: any;
  onClose: () => void;
}

export default function ReadDiary({ diaryData, onClose }: ReadDiaryProps) {
  const [loading, setLoading] = useState(false);

  // ✅ 삭제 요청 함수 추가
  const handleDelete = async () => {
    if (!diaryData.date) {
      alert("삭제할 일기 날짜가 없습니다.");
      return;
    }

    const confirmDelete = window.confirm("정말로 이 일기를 삭제하시겠습니까?");
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/diary?date=${diaryData.date}`, {
        method: "DELETE",
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "삭제 실패");

      alert("일기가 성공적으로 삭제되었습니다.");
      onClose(); // ✅ 다이어리 닫기
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("일기 삭제 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

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

      {/* ✅ 삭제 버튼 추가 */}
      <div className={styles.diaryButtons}>
        <button
          className={`${styles.diaryButton} ${styles.deleteButton}`}
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? "삭제 중..." : "🗑 기록 삭제"}
        </button>
        <button
          className={`${styles.diaryButton} ${styles.recommendButton}`}
          onClick={() => alert("OTT 추천 기능 준비 중!")}
        >
          🎥 OTT 추천받기
        </button>
      </div>
    </div>
  );
}
