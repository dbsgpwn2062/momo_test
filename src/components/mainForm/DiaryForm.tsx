"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/DiaryForm.module.css";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import EmojiPicker from "@/components/mainForm/EmojiPicker";
import { emojiMappings } from "@../../utils/emojiMappings";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ✅ 이모지 변환 함수 추가
const convertToTextArray = (emojiList: string[]): string[] => {
  return emojiList.map((emoji) => emojiMappings[emoji] || emoji);
};

interface DiaryFormProps {
  date: Date | null;
  diaryData: any;
  onClose: () => void;
  onSave: () => Promise<void>;
}

export default function DiaryForm({
  date,
  diaryData,
  onClose,
  onSave,
}: DiaryFormProps) {
  const router = useRouter();
  const [diary, setDiary] = useState("");
  const [selectedWeather, setSelectedWeather] = useState<string>("");
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [selectedDaily, setSelectedDaily] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const formattedDate = date
    ? dayjs(date).locale("ko").format("YYYY년 M월 D일 dddd")
    : "날짜 선택 안됨";

  // ✅ GET 데이터 적용
  useEffect(() => {
    if (diaryData) {
      console.log("📜 불러온 일기 데이터:", diaryData);
      setDiary(diaryData.diary || "");
      setSelectedWeather(diaryData.emoticons?.weather || "");
      setSelectedEmojis(diaryData.emoticons?.emotion || []);
      setSelectedDaily(diaryData.emoticons?.daily || []);
      setSelectedActivities(diaryData.emoticons?.activity || []);
    } else {
      console.warn("⚠️ diaryData 없음. 초기화 진행");
      setDiary("");
      setSelectedWeather("");
      setSelectedEmojis([]);
      setSelectedDaily([]);
      setSelectedActivities([]);
    }
    setResetTrigger((prev) => prev + 1);
  }, [diaryData, date]);

  // ✅ 저장 버튼 기능 (POST 요청)
  const handleSave = async () => {
    if (!date) {
      alert("날짜를 선택하세요.");
      return;
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

    setIsSaving(true);

    try {
      const idToken = sessionStorage.getItem("idToken");
      if (!idToken) {
        alert("로그인이 필요합니다.");
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/home/calendar/write`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("저장 실패");
      }

      console.log("✅ 저장 성공!");
      alert("일기가 성공적으로 저장되었습니다!");

      await onSave();
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
        selected={selectedEmojis.join(",")}
        onSelect={(e) => setSelectedEmojis(e.split(","))}
        resetTrigger={resetTrigger}
      />
      <EmojiPicker
        title="일상"
        type="daily"
        selected={selectedDaily.join(",")}
        onSelect={(e) => setSelectedDaily(e.split(","))}
        resetTrigger={resetTrigger}
      />
      <EmojiPicker
        title="활동"
        type="activity"
        selected={selectedActivities.join(",")}
        onSelect={(e) => setSelectedActivities(e.split(","))}
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
