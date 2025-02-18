import styles from "@/styles/RecommendationPopup.module.css";

interface ContentPopupProps {
  content: {
    title: string;
    poster_url: string;
  };
  onClose: () => void;
}

export default function ContentRecommendPopup({
  content,
  onClose,
}: ContentPopupProps) {
  return (
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
}
