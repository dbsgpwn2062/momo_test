interface Content {
  title: string;
  poster_url: string;
}

interface MBTIContents {
  [mbtiType: string]: Content[];
}

export const fetchMBTIRecommendations = async (): Promise<MBTIContents> => {
  try {
    const response = await fetch("/api/mbti_top5");
    if (!response.ok) {
      throw new Error("Failed to fetch MBTI recommendations");
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const fetchMBTIEmotionStats = async () => {
  const response = await fetch("/api/mbti_emotion"); // Next.js API 호출
  if (!response.ok) {
    throw new Error("Failed to fetch MBTI emotion stats");
  }
  return response.blob(); // 이미지 데이터를 반환
};
