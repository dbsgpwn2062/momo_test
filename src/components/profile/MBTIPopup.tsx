"use client";

import { useState } from "react";
import MBTIButton from "@/components/profile/MBTIButton";
import MBTITest from "@/components/profile/MBTITest";
import styles from "@/styles/Profile.module.css";

interface MBTIPopupProps {
  onClose: () => void;
  onSelect: (mbti: string) => void;
}

export default function MBTIPopup({ onClose, onSelect }: MBTIPopupProps) {
  const [step, setStep] = useState<
    "SELECT" | "KNOW" | "DONT_KNOW" | "METHOD" | "SELECT_MBTI"
  >("SELECT");

  // ✅ MBTI 검사 사이트로 이동하는 함수
  const handleOpenMBTITest = () => {
    window.open("https://www.16personalities.com/ko", "_blank");
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ✖
        </button>

        {/* ✅ MBTI를 알고 있는지 선택 */}
        {step === "SELECT" && (
          <>
            <h2 className={styles.popupTitle}>본인의 MBTI를 알고 있나요?</h2>
            <div className={styles.choiceContainer}>
              <button
                className={styles.choiceButton}
                onClick={() => setStep("SELECT_MBTI")}
              >
                네, 알고 있어요
              </button>
              <button
                className={styles.choiceButton}
                onClick={() => setStep("METHOD")}
              >
                아니요, 몰라요
              </button>
            </div>
          </>
        )}

        {/* ✅ MBTI 성향 찾는 방법 선택 */}
        {step === "METHOD" && (
          <>
            <h2 className={styles.popupTitle}>어떻게 MBTI를 찾을까요?</h2>
            <div className={styles.choiceContainer}>
              <button
                className={styles.choiceButton}
                onClick={() => setStep("DONT_KNOW")}
              >
                간단히 4가지 성향 선택할게요
              </button>
              <button
                className={styles.choiceButton}
                onClick={handleOpenMBTITest}
              >
                MBTI 검사하고 올게요
              </button>
            </div>
          </>
        )}

        {/* ✅ MBTI 16개 중 선택하는 창 */}
        {step === "SELECT_MBTI" && (
          <MBTIButton onSelect={onSelect} onClose={onClose} />
        )}

        {/* ✅ MBTI를 모를 경우 4가지 성향 선택 */}
        {step === "DONT_KNOW" && (
          <MBTITest onSelect={onSelect} onClose={onClose} />
        )}
      </div>
    </div>
  );
}
