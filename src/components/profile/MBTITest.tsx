"use client";

import { useState } from "react";
import styles from "@/styles/Profile.module.css";

interface MBTITestProps {
  onSelect: (mbti: string) => void;
  onClose: () => void;
}

export default function MBTITest({ onSelect, onClose }: MBTITestProps) {
  const [step, setStep] = useState(0);
  const [mbtiParts, setMbtiParts] = useState(["", "", "", ""]);

  const options = [
    {
      title: "성향이 어떻게 되나요?",
      left: "E",
      leftDesc: "외향형",
      right: "I",
      rightDesc: "내향형",
    },
    {
      title: "성향이 어떻게 되나요?",
      left: "S",
      leftDesc: "감각형",
      right: "N",
      rightDesc: "직관형",
    },
    {
      title: "성향이 어떻게 되나요?",
      left: "T",
      leftDesc: "사고형",
      right: "F",
      rightDesc: "감정형",
    },
    {
      title: "성향이 어떻게 되나요?",
      left: "P",
      leftDesc: "인식형",
      right: "J",
      rightDesc: "판단형",
    },
  ];

  const handleSelect = (value: string) => {
    const newParts = [...mbtiParts];
    newParts[step] = value;
    setMbtiParts(newParts);

    if (step < 3) {
      setStep(step + 1);
    } else {
      onSelect(newParts.join(""));
      onClose(); // 모든 선택 완료 후 팝업 닫기
    }
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <div className={styles.closeWrapper}>
          <button className={styles.closeButton} onClick={onClose}>
            ✖
          </button>
        </div>
        <h2>{options[step].title}</h2>
        <div className={styles.mbtiGrid}>
          <button
            className={`${styles.mbtiOption} ${
              mbtiParts[step] === options[step].left ? styles.selected : ""
            }`}
            onClick={() => handleSelect(options[step].left)}
          >
            <strong>{options[step].left}</strong>
            <span>{options[step].leftDesc}</span>
          </button>
          <button
            className={`${styles.mbtiOption} ${
              mbtiParts[step] === options[step].right ? styles.selected : ""
            }`}
            onClick={() => handleSelect(options[step].right)}
          >
            <strong>{options[step].right}</strong>
            <span>{options[step].rightDesc}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
