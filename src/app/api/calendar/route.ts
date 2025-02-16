import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

// ✅ GET: 특정 날짜 or 월별 데이터 가져오기
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = searchParams.get("year");
  let month = searchParams.get("month");

  // ✅ 쿠키에서 idToken 가져오기
  const cookieHeader = req.headers.get("cookie");
  console.log("📌 [GET] 요청 헤더의 쿠키 값:", cookieHeader);

  const cookies = Object.fromEntries(
    cookieHeader?.split("; ").map((c) => c.split("=")) || []
  );
  const idToken = cookies["idToken"];

  if (!idToken) {
    console.warn("❌ [GET] idToken이 없음 (401 Unauthorized)");
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  if (!year || !month) {
    console.warn("❌ [GET] 연도/월 파라미터 누락 (400 Bad Request)");
    return NextResponse.json(
      { error: "연도와 월 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const formattedMonth = month.padStart(2, "0"); // 📌 1월 -> 01월 변환
    console.log(
      `📡 [GET] 백엔드 요청 URL: ${API_BASE_URL}/home/calendar/monthread/${year}-${formattedMonth}`
    );

    const response = await fetch(
      `${API_BASE_URL}/home/calendar/monthread/${year}-${formattedMonth}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${idToken}` },
      }
    );

    if (!response.ok) {
      console.error("❌ [GET] 백엔드 응답 실패:", response.status);
      throw new Error(`서버 응답 실패 (HTTP ${response.status})`);
    }

    const data = await response.json();
    console.log("✅ [GET] 캘린더 데이터 응답:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ [GET] 서버 오류 발생:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
