"use client";

import styles from "@/styles/ReadDiary.module.css";
import { useState, useEffect } from "react";
import { emojiMappings } from "@../../utils/emojiMappings";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"; // ✅ 페이지 이동을 위해 추가

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
  const [isChecked, setIsChecked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const [showMbtiPopup, setShowMbtiPopup] = useState(false); // ✅ MBTI 팝업 상태 추가
  const router = useRouter(); // ✅ 페이지 이동을 위한 router

  // ✅ 디버깅: `diaryData`가 올바르게 전달되는지 확인
  useEffect(() => {
    console.log("✅ ReadDiary.module.css import 확인: ", styles);
    console.log("📌 diaryData 확인:", diaryData);
  }, [diaryData]);

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
      const res = await fetch(`/api/diary?date=${date}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "삭제 실패");

      alert("일기가 성공적으로 삭제되었습니다.");
      onDeleteSuccess(date);
      onClose();
    } catch (error) {
      alert("일기 삭제 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ OTT 콘텐츠 추천 API 호출 함수
  const handleRecommend = async () => {
    if (!diaryData?.date) {
      alert("날짜 정보가 없습니다.");
      return;
    }

    // ✅ 쿠키에서 사용자 정보 가져오기
    const userInfoCookie = Cookies.get("user_info");
    if (!userInfoCookie) {
      alert("로그인 정보가 없습니다. 다시 로그인해주세요.");
      return;
    }

    const userInfo = JSON.parse(userInfoCookie);
    const userMbti = userInfo.mbti || "";

    // ✅ MBTI가 없으면 회원정보 수정 페이지로 안내
    if (!userMbti) {
      setShowMbtiPopup(true);
      return;
    }

    const requestBody = {
      date: diaryData.date,
      type: isChecked ? "sub" : "all",
      mbti: userMbti, // ✅ MBTI 포함하여 요청
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

      setRecommendation(data.bedrock_response);
      setShowPopup(true);
    } catch (error) {
      alert("콘텐츠 추천 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 이모지 출력 로직
  const allEmojis = [
    ...(diaryData?.emoticons?.weather ? [diaryData.emoticons.weather] : []),
    ...(diaryData?.emoticons?.emotion || []),
    ...(diaryData?.emoticons?.daily || []),
    ...(diaryData?.emoticons?.activity || []),
  ];

  return (
    <div className={`${styles.diaryPanel} ${styles.open}`}>
      <button className={styles.closeButton} onClick={onClose}>
        ✖
      </button>
      <div className={styles.diaryContainer}>
        {/* 🗑 삭제 버튼 (오른쪽 상단) */}
        <button
          className={styles.deleteButton}
          onClick={() => handleDelete(diaryData.date)}
        >
          🗑
        </button>

        {/* 📌 일기 제목 */}
        <h2 className={styles.diaryTitle}>{diaryData.date} 일기</h2>

        {/* 📌 이모지 리스트 */}
        <div className={styles.emojiSection}>
          {allEmojis.map((emoji, index) => {
            const imagePath = Object.keys(emojiMappings).find(
              (key) => emojiMappings[key] === emoji
            );
            return imagePath ? (
              <img
                key={index}
                src={imagePath}
                alt={emoji}
                className={styles.emojiImage}
              />
            ) : null;
          })}
        </div>

        {/* 📌 일기 내용 */}
        {diaryData.diary && (
          <p className={styles.diaryText}>{diaryData.diary}</p>
        )}
      </div>

      {/* 📌 체크박스 */}
      <div className={styles.checkboxContainer}>
        <label>
          <input
            className="margin-right: 5px;"
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          구독하고 있는 플랫폼에서만 추천받을게요!
        </label>
      </div>

      {/* 📌 OTT 추천 버튼 */}
      <button className={styles.recommendButton} onClick={handleRecommend}>
        🎥 OTT 추천받기
      </button>

      {/* 📌 추천 결과 팝업 */}
      {showPopup && (
        <div className={styles.recommendPopup}>
          <p className={styles.title}>오늘의 추천 콘텐츠</p>
          <div className={styles.recommendContent}>
            <p>{recommendation}</p>
          </div>
          <button
            className={styles.closeButton2}
            onClick={() => setShowPopup(false)}
          >
            닫기
          </button>
        </div>
      )}

      {/* 📌 MBTI 없음 팝업 */}
      {showMbtiPopup && (
        <div className={styles.recommendPopup}>
          <p>등록된 회원 MBTI가 없습니다. 회원정보를 수정해주세요.</p>
          <button onClick={() => router.push("/profile")}>회원정보 수정</button>
        </div>
      )}
    </div>
  );
}
