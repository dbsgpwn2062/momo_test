"use client";

import styles from "@/styles/DiaryForm.module.css";
import { useState } from "react";

interface ReadDiaryProps {
  diaryData: any;
  onClose: () => void;
  onDeleteSuccess?: (date: string) => void;
}

export default function ReadDiary({
  diaryData,
  onClose,
  onDeleteSuccess = () => {},
}: ReadDiaryProps) {
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // ✅ 체크박스 상태 추가
  const [showPopup, setShowPopup] = useState(false);
  const [recommendation, setRecommendation] = useState("");

  // ✅ 삭제 요청 함수
  const handleDelete = async (date: string) => {
    if (!date) {
      alert("삭제할 일기 날짜가 없습니다.");
      return;
    }

    const confirmDelete = window.confirm("정말로 이 일기를 삭제하시겠습니까?");
    if (!confirmDelete) return;

    setLoading(true);
    try {
      console.log("[DELETE] 요청 보냄: ", date);
      const res = await fetch(`/api/diary?date=${date}`, {
        method: "DELETE",
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "삭제 실패");

      alert("일기가 성공적으로 삭제되었습니다.");
      onDeleteSuccess(date);
      onClose();
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("일기 삭제 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 콘텐츠 추천 API 호출 함수
  const handleRecommend = async () => {
    if (!diaryData?.date) {
      alert("날짜 정보가 없습니다.");
      return;
    }

    const requestBody = {
      date: diaryData.date,
      type: isChecked ? "sub" : "all", // ✅ 체크박스 상태에 따라 타입 결정
    };

    try {
      setLoading(true);
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "추천 실패");

      setRecommendation(data.bedrock_response); // ✅ 추천 결과 저장
      setShowPopup(true); // ✅ 팝업 띄우기
    } catch (error) {
      console.error("추천 실패:", error);
      alert("콘텐츠 추천 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.diaryPanel} ${styles.open}`}>
      <button className={styles.closeButton} onClick={onClose}>
        ✖
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

      {/* ✅ 체크박스 추가 */}
      <div className={styles.checkboxContainer}>
        <label>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          구독하고 있는 플랫폼에서만 추천받기
        </label>
      </div>

      {/* ✅ 삭제 & 추천 버튼 */}
      <div className={styles.diaryButtons}>
        <button
          className={`${styles.diaryButton} ${styles.deleteButton}`}
          onClick={() => handleDelete(diaryData.date)}
        >
          🗑 기록 삭제
        </button>
        <button
          className={`${styles.diaryButton} ${styles.recommendButton}`}
          onClick={handleRecommend}
        >
          🎥 OTT 추천받기
        </button>
      </div>

      {/* ✅ 추천 결과 팝업 */}
      {showPopup && (
        <div className={styles.popup}>
          <p>{recommendation}</p>
          <button onClick={() => setShowPopup(false)}>닫기</button>
        </div>
      )}
    </div>
  );
}
