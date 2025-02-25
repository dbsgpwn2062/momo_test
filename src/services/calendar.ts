// ✅ 특정 날짜의 일기 데이터를 가져오는 함수 (diary API 사용)
export const fetchDiaryData = async (date: string) => {
  try {
    const response = await fetch(
      `/api/diary?date=${encodeURIComponent(date)}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`❌ 일기 데이터를 가져오는데 실패: ${errorData.error}`);
    }

    return await response.json();
  } catch (error) {
    console.error("🚨 Error fetching diary data:", error);
    return null;
  }
};

// ✅ 특정 월의 작성된 일기 날짜 목록을 가져오는 함수 (calendar API 사용)
export const fetchMonthData = async (year: number, month: number) => {
  try {
    const response = await fetch(`/api/calendar?year=${year}&month=${month}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("❌ 월별 데이터를 가져오는데 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("📌 Error fetching month data:", error);
    return null;
  }
};
