"use client";

import styles from "@/styles/ReadDiary.module.css";
import { useState, useEffect } from "react";
import { emojiMappings } from "@../../utils/emojiMappings";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"; // ✅ 페이지 이동을 위해 추가
import dayjs from "dayjs";
import RecommendationContent from "@/components/mainForm/RecommendationContent";
import RecommendationPopup from "@/components/mainForm/RecommendationPopup";
import LoadingPopup from "@/components/ui/LoadingPopup"; // 로딩 팝업 임포트
import { searchYoutubeTrailer } from "@/services/youtube";

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [youtubeVideoId, setYoutubeVideoId] = useState<string | null>(null);
  const [showYoutubePopup, setShowYoutubePopup] = useState(false);
  const [posterData, setPosterData] = useState<{
    title: string;
    poster_url: string;
  } | null>(null);

  // ✅ 디버깅: `diaryData`가 올바르게 전달되는지 확인
  useEffect(() => {
    console.log("✅ ReadDiary.module.css import 확인: ", styles);
    console.log("📌 diaryData 확인:", diaryData);
  }, [diaryData]);

  // ✅ 삭제 요청 함수
  const handleDelete = async () => {
    setIsDeleting(true); // 삭제 시작
    try {
      const confirmDelete = window.confirm(
        "정말로 이 일기를 삭제하시겠습니까?"
      );
      if (!confirmDelete) return;

      const res = await fetch(`/api/diary?date=${diaryData.date}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "삭제 실패");

      alert("일기가 성공적으로 삭제되었습니다.");
      await onDeleteSuccess(diaryData.date);
      onClose();
    } catch (error) {
      alert("일기 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
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
      setLoading(true); // 로딩 시작
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
      setLoading(false); // 로딩 종료
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

  // YouTube 검색 함수
  const handleYoutubeSearch = async () => {
    if (!recommendContent) {
      alert("추천 콘텐츠가 없습니다. 먼저 OTT 추천을 받아주세요.");
      return;
    }

    try {
      // recommendContent에서 제목 추출 (첫 번째 줄이 제목이라고 가정)
      const title = recommendContent.split("\n")[0];
      const result = await searchYoutubeTrailer(title);
      setYoutubeVideoId(result.videoId);
      setShowYoutubePopup(true);
    } catch (error) {
      console.error("YouTube 검색 실패:", error);
      alert("예고편을 찾을 수 없습니다.");
    }
  };

  // 포스터만 가져오는 함수
  const getPosterUrl = async () => {
    try {
      const date = dayjs(diaryData.date).format("YYYY-MM-DD");
      const response = await fetch(`/api/content?date=${date}`);
      const data = await response.json();

      if (data.content_info) {
        setPosterData({
          title: data.content_info.title,
          poster_url: data.content_info.poster_url,
        });
      }
    } catch (error) {
      console.error("포스터 데이터 로드 실패:", error);
    }
  };

  // useEffect에서 포스터 가져오기
  useEffect(() => {
    if (recommendContent) {
      getPosterUrl();
    }
  }, [recommendContent]);

  return (
    <div className={`${styles.diaryPanel} ${styles.open}`}>
      <div className={styles.scrollContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          ✖
        </button>
        <div className={styles.diaryContainer}>
          {/* 🗑 삭제 버튼 (오른쪽 상단) */}
          <button className={styles.deleteButton} onClick={handleDelete}>
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
        <div className={styles.resultContent}>
          <h2 className={styles.diaryTitle}>오늘의 OTT 콘텐츠</h2>
          <RecommendationContent
            recommendContent={recommendContent}
            resultEmotion={resultEmotion}
            posterUrl={posterData?.poster_url}
          />

          {/* 추천 콘텐츠가 있을 때만 YouTube 버튼 표시 */}
          {recommendContent && (
            <div className={styles.youtubeButtonWrapper}>
              <button
                className={styles.youtubeButton}
                onClick={handleYoutubeSearch}
              >
                <img
                  src="icon-ott/icon-youtube.png"
                  alt="youtube"
                  className={styles.youtubeIcon}
                />
                예고편 보기
              </button>
            </div>
          )}

          {/* 추천 콘텐츠가 없을 때 추천받기 버튼들 표시 */}
          {!recommendContent && (
            <>
              <div className={styles.checkboxContainer}>
                <label>
                  구독하고 있는 플랫폼에서만
                  <br />
                  추천받을게요! &nbsp;&nbsp;
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
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
            <p className={styles.title}>오늘의 추천 OTT</p>
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
          <div className={styles.recommendPopup1}>
            <h3 className={styles.title}>오늘의 추천 OTT</h3>
            <div className={styles.posterContainer}>
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
          <div className={styles.recommendPopup2}>
            <p>등록된 회원 MBTI가 없습니다. </p>
            <p>회원정보를 수정해주세요.</p>
            <button onClick={() => router.push("/profile")}>
              회원정보 수정
            </button>
          </div>
        )}
      </div>
      <LoadingPopup isOpen={loading} message="momo가 답변을 작성 중이예요..." />
      {isDeleting && (
        <LoadingPopup isOpen={true} message="momo가 삭제 중입니다..." />
      )}

      {/* YouTube 팝업 - return 문 마지막에 추가 */}
      {showYoutubePopup && youtubeVideoId && (
        <div
          className={styles.youtubePopup}
          onClick={() => setShowYoutubePopup(false)}
        >
          <div
            className={styles.youtubeContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeVideoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button
              className={styles.closeButton}
              onClick={() => setShowYoutubePopup(false)}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
