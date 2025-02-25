"use client";

import { useState } from "react";
import styles from "@/styles/Chart.module.css";
import styles1 from "@/styles/MainForm.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getTokenFromCookies } from "@/services/auth";

export default function ChartForm() {
  const router = useRouter();
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  const handleInsightClick = async () => {
    const token = await getTokenFromCookies();

    if (!token) {
      setShowLoginAlert(true);
      return;
    }

    router.push("/Insight");
  };

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.buttonContainer}>
        <div className={styles.trophyContainer}>
          <Image
            src="/utils/top.png"
            alt="트로피"
            width={80}
            height={70}
            className={styles.trophyImage}
          />
        </div>
        <button className={styles.chartButton} onClick={handleInsightClick}>
          <div className={styles.buttonContent}>
            <div className={styles.buttonText}>
              <span>MBTI별 영화 추천 순위 보러가기</span>
              <span className={styles.arrow}>→</span>
            </div>
          </div>
        </button>
        {/* <button className={styles.chartButton}>
          <div className={styles.buttonContent}>
            <div className={styles.buttonText}>
              <span>감정별 영화 추천 순위 보러가기</span>
              <span className={styles.arrow}>→</span>
            </div>
          </div>
        </button> */}
      </div>

      {/* 로그인 필요 알림 팝업 */}
      {showLoginAlert && (
        <div
          className={styles1.popupOverlay}
          onClick={() => setShowLoginAlert(false)}
        >
          <div
            className={styles1.popupContainer}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles1.popupContainerh3}>알림</h3>
            <p style={{ marginTop: "10px" }}>로그인이 필요한 서비스입니다.</p>
            <button
              className={styles1.popupButton}
              onClick={() => setShowLoginAlert(false)}
              style={{ marginTop: "20px" }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
