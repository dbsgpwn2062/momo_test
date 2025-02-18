"use client";

import styles from "@/styles/Chart.module.css";
import Image from "next/image";

export default function ChartForm() {
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
        <button className={styles.chartButton}>
          <div className={styles.buttonContent}>
            <div className={styles.buttonText}>
              <span>MBTI별 영화 추천 순위 보러가기</span>
              <span className={styles.arrow}>→</span>
            </div>
          </div>
        </button>
        <button className={styles.chartButton}>
          <div className={styles.buttonContent}>
            <div className={styles.buttonText}>
              <span>감정별 영화 추천 순위 보러가기</span>
              <span className={styles.arrow}>→</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
