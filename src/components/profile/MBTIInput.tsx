"use client";

import styles from "@/styles/Profile.module.css";

interface MBTIInputProps {
  value: string;
  onClick: () => void;
}

export default function MBTIInput({ value, onClick }: MBTIInputProps) {
  return (
    <div className={styles.mbtiInputContainer}>
      <input
        type="text"
        value={value}
        readOnly
        placeholder="MBTI 선택하기"
        className={styles.mbtiInput}
        onClick={onClick} // ✅ 클릭 이벤트 추가
      />
    </div>
  );
}
