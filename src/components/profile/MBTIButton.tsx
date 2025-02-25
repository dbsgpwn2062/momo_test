"use client";

import { useState } from "react";
import styles from "@/styles/Profile.module.css";

const MBTI_TYPES = [
  "ISTJ",
  "ISFJ",
  "INFJ",
  "INTJ",
  "ISTP",
  "ISFP",
  "INFP",
  "INTP",
  "ESTP",
  "ESFP",
  "ENFP",
  "ENTP",
  "ESTJ",
  "ESFJ",
  "ENFJ",
  "ENTJ",
];

interface MBTIButtonProps {
  onSelect: (mbti: string) => void;
  onClose: () => void;
}

export default function MBTIButton({ onSelect, onClose }: MBTIButtonProps) {
  const [selectedMBTI, setSelectedMBTI] = useState<string | null>(null);

  return (
    <div className={styles.mbtiPopup}>
      <h2 className={styles.popupTitle}>MBTI를 선택하세요</h2>

      {/* ✅ MBTI 버튼 4x4 그리드 정렬 */}
      <div className={styles.mbtiGrid}>
        {MBTI_TYPES.map((type) => (
          <button
            key={type}
            className={`${styles.mbtiButton} ${
              selectedMBTI === type ? styles.selected : ""
            }`}
            onClick={() => setSelectedMBTI(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* ✅ 확인 버튼 추가 */}
      <button
        className={styles.confirmButton}
        disabled={!selectedMBTI}
        onClick={() => {
          if (selectedMBTI) {
            onSelect(selectedMBTI);
            onClose();
          }
        }}
      >
        확인
      </button>
    </div>
  );
}
