export const fetchRecommendData = async (date: string) => {
  try {
    const res = await fetch(`/api/recommend?date=${date}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "추천 데이터 가져오기 실패");
    }

    const data = await res.json();
    return data; // ✅ 배드락 응답 (추천 데이터) 반환
  } catch (error) {
    console.error("❌ 추천 데이터 가져오기 실패:", error);
    return null;
  }
};
