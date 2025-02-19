"use client";

import { useState, useEffect } from "react";
import { saveDiaryData } from "@/services/diary";
import styles from "@/styles/DiaryForm.module.css";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import EmojiPicker from "@/components/mainForm/EmojiPicker";
import { emojiMappings } from "@../../utils/emojiMappings";

// ✅ 이모지 변환 함수
const convertToTextArray = (emojiList: string[]): string[] => {
  return emojiList.map((emoji) => emojiMappings[emoji] || emoji);
};

interface DiaryFormProps {
  date: Date;
  diaryData: any;
  onClose: () => void;
  onSave?: () => void;
}

export default function DiaryForm({
  date,
  diaryData,
  onClose,
  onSave = () => {},
}: DiaryFormProps) {
  const [diary, setDiary] = useState("");
  const [selectedWeather, setSelectedWeather] = useState("");
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [selectedDaily, setSelectedDaily] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const formattedDate = date
    ? dayjs(date).locale("ko").format("YYYY년 M월 D일 dddd")
    : "날짜 선택 안됨";

  // ✅ 기존 데이터 불러와서 세팅
  useEffect(() => {
    if (diaryData) {
      setDiary(diaryData.diary || "");
      setSelectedWeather(diaryData.emoticons?.weather || "");
      setSelectedEmojis(diaryData.emoticons?.emotion || []);
      setSelectedDaily(diaryData.emoticons?.daily || []);
      setSelectedActivities(diaryData.emoticons?.activity || []);
    } else {
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

    setIsSaving(true);

    try {
      await saveDiaryData(payload);
      alert("일기가 성공적으로 저장되었습니다!");
      await onSave(); // ✅ 저장 후 캘린더 즉시 반영
    } catch (error) {
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`${styles.diaryPanel} ${styles.open}`}>
      <div className={styles.scrollContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          ✖
        </button>
        <h2
          style={{
            fontFamily: "Wellstudy, sans-serif",
            fontSize: "30px",
          }}
        >
          {formattedDate}
        </h2>

        {/* ✅ 이모지 선택 UI */}
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
          placeholder="일기를 작성하면 momo가 더 자세히 찾아봐드릴게요🔍"
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
    </div>
  );
}
