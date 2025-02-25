// ✅ 프론트에서 `/api/diary`를 통해 백엔드 API 호출하도록 설정
export const fetchDiaryData = async (date: string) => {
  const response = await fetch(`/api/diary?date=${date}`, { method: "GET" });

  if (!response.ok) {
    throw new Error("일기 데이터를 불러오는데 실패했습니다.");
  }

  return response.json();
};

export const saveDiaryData = async (payload: any) => {
  const response = await fetch("/api/diary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("일기 저장 실패");
  }

  return response.json();
};
