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
      // 현재 날짜로 추천 콘텐츠 API 호출
      const date = dayjs(diaryData.date).format("YYYY-MM-DD");
      const response = await fetch(`/api/recommendContent?date=${date}`);

      if (!response.ok) {
        throw new Error("추천 콘텐츠를 가져오는데 실패했습니다.");
      }

      const data = await response.json();

      // 기존 일기 내용에 추천 콘텐츠 추가
      const newContent = `${diary}\n\n[추천 콘텐츠]\n${data.recommend_content}\n\n[감정 분석]\n${data.result_emotion}`;
      setDiary(newContent);

      // API로 업데이트된 내용 저장
      await fetch(`/api/diary?date=${date}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          diary: newContent,
          // 기존 다이어리 데이터 유지
          emoticons: diaryData.emoticons,
        }),
      });
    } catch (error) {
      console.error("추천 콘텐츠 추가 실패:", error);
      alert("추천 콘텐츠를 추가하는데 실패했습니다.");
    }

    setIsRecommendationOpen(false);
    onRecommendationSave?.();
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
      const response = await fetch(`/api/recommendContent?date=${date}`);

      if (!response.ok) {
        throw new Error("콘텐츠 데이터를 가져오는데 실패했습니다.");
      }

      const data = await response.json();
      if (data.content_info) {
        setContentData({
          title: data.content_info.title,
          poster_url: data.content_info.poster_url
        });
      }
    } catch (error) {
      console.error("콘텐츠 데이터 로드 실패:", error);
      alert("콘텐츠 데이터를 가져오는데 실패했습니다.");
    }
  };

  return (
    <div className={`