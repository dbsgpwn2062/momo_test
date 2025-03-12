import styles from "@/styles/ReadDiary.module.css";

interface RecommendationContentProps {
  recommendContent: string | null;
  resultEmotion: string | null;
  posterUrl?: string;
}

export default function RecommendationContent({
  recommendContent,
  resultEmotion,
  posterUrl,
}: RecommendationContentProps) {
  if (!recommendContent && !resultEmotion) return null;

  // ✅ 감정 분석 텍스트 정리
  const cleanEmotion = (emotion: string) => {
    if (!emotion) return "";
    // 추천 콘텐츠 부분 제거
    const textWithoutRecommend = emotion.split("추천 콘텐츠")[0].trim();
    // 줄바꿈 처리
    return textWithoutRecommend.split("\\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div className={styles.recommendationSection}>
      {recommendContent && (
        <div className={styles.recommendContent}>
          <h3>📌 추천 콘텐츠</h3>
          {posterUrl && (
            <div className={styles.contentPosterWrapper}>
              <img
                src={posterUrl}
                alt="콘텐츠 포스터"
                className={styles.contentPosterImage}
              />
            </div>
          )}
          <p>{recommendContent}</p>
        </div>
      )}
      {resultEmotion && (
        <div className={styles.emotionAnalysis}>
          <h3>📌 감정 분석</h3>
          <p>{cleanEmotion(resultEmotion)}</p>
        </div>
      )}
    </div>
  );
}
