"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/DiaryForm.module.css";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import EmojiPicker from "@/components/mainForm/EmojiPicker";
import { emojiMappings } from "@../../utils/emojiMappings"; // ✅ import 경로 수정

// ✅ 환경 변수에서 API BASE URL 가져오기
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface DiaryFormProps {
  date: Date | null;
  onSave: (data: { date: Date; content: string }) => void; // ✅ date가 항상 `Date` 객체여야 함
  onClose: () => void;
}

export default function DiaryForm({ date, onSave, onClose }: DiaryFormProps) {
  const router = useRouter();
  const [diary, setDiary] = useState("");
  const [selectedWeather, setSelectedWeather] = useState<string>(""); // ✅ 단일 선택
  const [selectedEmojis, setSelectedEmojis] = useState<string>(""); // ✅ 쉼표 구분된 문자열 유지
  const [selectedDaily, setSelectedDaily] = useState<string>(""); // ✅ 쉼표 구분된 문자열 유지
  const [selectedActivities, setSelectedActivities] = useState<string>(""); // ✅ 쉼표 구분된 문자열 유지
  const [resetTrigger, setResetTrigger] = useState(0);
  const [isSaving, setIsSaving] = useState(false); // ✅ 저장 중 상태 관리

  const formattedDate = date
    ? dayjs(date).locale("ko").format("YYYY년 M월 D일 dddd")
    : "날짜 선택 안됨";

  // ✅ 날짜 변경 시 모든 선택 초기화
  useEffect(() => {
    setDiary("");
    setSelectedWeather("");
    setSelectedEmojis("");
    setSelectedDaily("");
    setSelectedActivities("");
    setResetTrigger((prev) => prev + 1);
  }, [date]);

  // ✅ API 요청을 위한 이모지 변환
  const convertToTextArray = (emojiString: string) => {
    return emojiString
      ? emojiString.split(",").map((emoji) => emojiMappings[emoji] || emoji)
      : [];
  };

  // ✅ 저장 및 API 전송
  const handleSave = async () => {
    if (!date) {
      alert("날짜를 선택하세요.");
      console.error("⚠️ DiaryForm에서 date가 undefined입니다.");
      return; // ✅ date가 undefined면 실행하지 않음
    }

    const formattedDateKey = dayjs(date).format("YYYY-MM-DD");
    const weatherText = emojiMappings[selectedWeather] || null;

    const payload = {
      [formattedDateKey]: {
        diary,
        emoticons: {
          weather: weatherText,
          emotion: convertToTextArray(selectedEmojis),
          daily: convertToTextArray(selectedDaily),
          activity: convertToTextArray(selectedActivities),
        },
        recommend_content: null,
        result_emotion: null,
      },
    };

    console.log("📤 저장 데이터:", JSON.stringify(payload, null, 2));

    setIsSaving(true); // ✅ 저장 시작

    try {
      const idToken = sessionStorage.getItem("idToken"); // ✅ Cognito idToken 가져오기
      if (!idToken) {
        alert("로그인이 필요합니다.");
        console.warn(
          "⚠️ idToken이 존재하지 않습니다. 로그인 페이지로 이동합니다."
        );
        router.push("/login"); // 로그인 페이지로 이동
        return;
      }

      const response = await fetch(`${API_BASE_URL}/home/calendar/write`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`, // ✅ Cognito idToken 인증 추가
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ 서버 응답 오류:", errorText);
        throw new Error("저장 실패");
      }

      const result = await response.json();
      console.log("✅ 저장 성공:", result);
      alert("일기가 성공적으로 저장되었습니다!");

      // ✅ onSave 호출 시 항상 Date 객체를 넘기도록 보장
      onSave({ date, content: diary });
    } catch (error) {
      console.error("❌ 저장 오류:", error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`${styles.diaryPanel} ${styles.open}`}>
      <button className={styles.closeButton} onClick={onClose}>
        ✖ 닫기
      </button>
      <h2>{formattedDate}</h2>

      <EmojiPicker
        title="날씨"
        type="weather"
        selected={selectedWeather}
        onSelect={setSelectedWeather}
        resetTrigger={resetTrigger}
      />
      <EmojiPicker
        title="기분"
        type="emotion"
        selected={selectedEmojis}
        onSelect={setSelectedEmojis}
        resetTrigger={resetTrigger}
      />
      <EmojiPicker
        title="일상"
        type="daily"
        selected={selectedDaily}
        onSelect={setSelectedDaily}
        resetTrigger={resetTrigger}
      />
      <EmojiPicker
        title="활동"
        type="activity"
        selected={selectedActivities}
        onSelect={setSelectedActivities}
        resetTrigger={resetTrigger}
      />

      <textarea
        value={diary}
        onChange={(e) => setDiary(e.target.value)}
        placeholder="오늘의 일기를 작성하세요..."
        className={styles.textarea}
      />
      <button
        onClick={handleSave}
        className={styles.button}
        disabled={isSaving}
      >
        {isSaving ? "저장 중..." : "저장"}
      </button>
    </div>
  );
}
