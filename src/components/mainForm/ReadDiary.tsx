"use client";

import styles from "@/styles/ReadDiary.module.css";
import { useState, useEffect } from "react";
import { emojiMappings } from "@../../utils/emojiMappings";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"; // ✅ 페이지 이동을 위해 추가
import dayjs from "dayjs";
import RecommendationContent from "@/components/mainForm/RecommendationContent";
import RecommendationPopup from "@/components/mainForm/RecommendationPopup";

interface ReadDiaryProps {
  diaryData: any;
  onClose: () => void;
  onDeleteSuccess?: (date: string) => void;
  onRecommendationSave?: () => Promise<void>;
}

export default function ReadDiary({
  diaryData,
  onClose,
  onDeleteSuccess = () => {},
  onRecommendationSave,
}: ReadDiaryProps) {
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [recommendation, setRecommendation] = useState("");
  const [showMbtiPopup, setShowMbtiPopup] = useState(false); // ✅ MBTI 팝업 상태 추가
  const [diary, setDiary] = useState(diaryData.diary || "");
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(false);
  const router = useRouter(); // ✅ 페이지 이동을 위한 router
  const [recommendContent, setRecommendContent] = useState<string | null>(null);
  const [resultEmotion, setResultEmotion] = useState<string | null>(null);
  const [contentData, setContentData] = useState<{
    title: string;
    poster_url: string;
  } | null>(null);

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
  const handleRecommendationClose = async () => {
    try {
      const date = dayjs(diaryData.date).format("YYYY-MM-DD");
      const response = await fetch(`/api/recommendContent?date=${date}`);

      if (!response.ok) {
        throw new Error("추천 콘텐츠를 가져오는데 실패했습니다.");
      }

      const data = await response.json();

      // 기존 일기 내용에 추천 콘텐츠 추가
      const newContent = `${diaryData.diary}\n\n[추천 콘텐츠]\n${data.recommend_content}\n\n[감정 분석]\n${data.result_emotion}`;

      // API로 업데이트된 내용 저장
      await fetch(`/api/diary?date=${date}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          diary: newContent,
          emoticons: diaryData.emoticons,
        }),
      });

      // 상태 업데이트
      setContentData(null);
      if (onRecommendationSave) {
        await onRecommendationSave();
      }
      await loadRecommendContent();
    } catch (error) {
      console.error("추천 콘텐츠 추가 실패:", error);
      alert("추천 콘텐츠를 추가하는데 실패했습니다.");
    }
  };
  // ✅ 이모지 출력 로직
  const allEmojis = [
    ...(diaryData?.emoticons?.weather ? [diaryData.emoticons.weather] : []),
    ...(diaryData?.emoticons?.emotion || []),
    ...(diaryData?.emoticons?.daily || []),
    ...(diaryData?.emoticons?.activity || []),
  ];

  // ✅ 추천 콘텐츠 로드 함수
  const loadRecommendContent = async () => {
    try {
      const date = diaryData.date;
      const response = await fetch(`/api/recommendContent?date=${date}`);
      if (response.ok) {
        const data = await response.json();
        // ✅ null 체크 추가
        if (data.recommend_content === null) {
          setRecommendContent(null);
          setResultEmotion(null);
        } else {
          setRecommendContent(data.recommend_content);
          setResultEmotion(data.result_emotion);
        }
      }
    } catch (error) {
      console.error("추천 콘텐츠 로드 실패:", error);
      // ✅ 에러 시에도 null로 설정
      setRecommendContent(null);
      setResultEmotion(null);
    }
  };

  // ✅ 컴포넌트 마운트 시와 diaryData 변경 시 데이터 로드
  useEffect(() => {
    loadRecommendContent();
  }, [diaryData.date]);

  // ✅ 팝업 닫기 핸들러
  const handlePopupClose = async () => {
    setShowPopup(false);
    await loadRecommendContent();
  };

  const fetchContentData = async () => {
    try {
      const date = dayjs(diaryData.date).format("YYYY-MM-DD");
      console.log("fetchContentData 호출됨, 날짜:", date);

      const response = await fetch(`/api/content?date=${date}`);
      const data = await response.json();

      // 에러 응답 처리
      if (!response.ok) {
        if (
          data.error &&
          data.error.includes("매칭되는 콘텐츠를 찾을 수 없습니다")
        ) {
          // 매칭되는 콘텐츠가 없는 경우, 기본 포스터 이미지 사용
          const titleMatch = data.error.match(/: (.+)$/);
          const title = titleMatch ? titleMatch[1] : "알 수 없는 콘텐츠";

          setContentData({
            title: title,
            poster_url: "/images/default_poster.png", // 기본 포스터 이미지 경로
          });
          return;
        }
        throw new Error(
          data.error || "콘텐츠 데이터를 가져오는데 실패했습니다."
        );
      }

      console.log("받아온 데이터:", data);

      if (data.content_info) {
        const newContentData = {
          title: data.content_info.title,
          poster_url: data.content_info.poster_url,
        };
        console.log("설정할 contentData:", newContentData);
        setContentData(newContentData);
      }
    } catch (error) {
      console.error("콘텐츠 데이터 로드 실패:", error);
      alert("콘텐츠 데이터를 가져오는데 실패했습니다.");
    }
  };

  useEffect(() => {
    console.log("contentData 변경됨:", contentData);
  }, [contentData]);

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

        {/* 📌 추천 콘텐츠 컴포넌트 */}
        <RecommendationContent
          recommendContent={recommendContent}
          resultEmotion={resultEmotion}
        />

        {/* 📌 체크박스와 추천 버튼 - 추천 콘텐츠가 null일 때만 표시 */}
        {recommendContent === null && (
          <>
            <div className={styles.checkboxContainer}>
              <label>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />
                구독하고 있는 플랫폼에서만 추천받을게요!
              </label>
            </div>
            <button
              className={styles.recommendButton}
              onClick={handleRecommend}
            >
              🎥 OTT 추천받기
            </button>
          </>
        )}
      </div>

      {/* 📌 추천 결과 팝업 */}
      {showPopup && (
        <div className={styles.recommendPopup}>
          <p className={styles.title}>오늘의 추천 콘텐츠</p>
          <div className={styles.recommendContent}>
            <p>{recommendation}</p>
          </div>
          <button
            className={styles.closeButton2}
            onClick={async () => {
              setShowPopup(false);
              await fetchContentData(); // 영화 정보 가져오기
            }}
          >
            다음 →
          </button>
        </div>
      )}

      {/* 📌 영화 포스터 팝업 */}
      {contentData && (
        <div className={styles.recommendPopup}>
          <h3 className={styles.title}>오늘의 추천 영화</h3>
          <div className={styles.contentContainer}>
            <img
              src={contentData.poster_url}
              alt={contentData.title}
              className={styles.posterImage}
            />
            <p className={styles.title}>{contentData.title}</p>
          </div>
          <button
            className={styles.closeButton2}
            onClick={handleRecommendationClose} // 함수 직접 연결
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
