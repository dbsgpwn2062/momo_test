import { useState } from "react";
import styles from "@/styles/ReadDiary.module.css";

interface RecommendationPopupProps {
  recommendation: string;
  onNext: () => void;
  onClose: () => void;
}

interface ContentPopupProps {
  content: {
    title: string;
    poster_url: string;
  };
  onClose: () => void;
}

const ContentRecommendPopup = ({ content, onClose }: ContentPopupProps) => (
  <div className={styles.recommendPopup}>
    <h3>OO님의 오늘의 추천 콘텐츠</h3>
    <div className={styles.contentContainer}>
      <img
        src={content.poster_url}
        alt={content.title}
        className={styles.posterImage}
      />
      <p className={styles.title}>{content.title}</p>
    </div>
    <button className={styles.closeButton} onClick={onClose}>
      다시 추천받기
    </button>
  </div>
);

export default function RecommendationPopup({
  recommendation,
  onNext,
  onClose,
}: RecommendationPopupProps) {
  const [showFirstPopup, setShowFirstPopup] = useState(true);

  return (
    <>
      {showFirstPopup ? (
        <div className={styles.recommendPopup}>
          <p className={styles.title}>오늘의 추천 콘텐츠</p>
          <div className={styles.recommendContent}>
            <p>{recommendation}</p>
          </div>
          <button
            className={styles.nextButton}
            onClick={() => {
              setShowFirstPopup(false);
              onNext();
            }}
          >
            다음 →
          </button>
        </div>
      ) : null}
    </>
  );
}

export { ContentRecommendPopup };
