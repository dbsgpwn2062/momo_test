import styles from "@/styles/ReadDiary.module.css";

interface RecommendationPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RecommendationPopup({
  isOpen,
  onClose,
}: RecommendationPopupProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.recommendPopup}>
      <p className={styles.title}>오늘의 추천 콘텐츠</p>
      <div className={styles.recommendContent}>
        <p>추천 콘텐츠가 일기에 추가되었습니다</p>
      </div>
      <button className={styles.closeButton2} onClick={onClose}>
        닫기
      </button>
    </div>
  );
}
