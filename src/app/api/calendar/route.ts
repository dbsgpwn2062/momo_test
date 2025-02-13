import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

// ✅ GET: 특정 날짜 or 월별 데이터 가져오기
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const year = searchParams.get("year");
  let month = searchParams.get("month");

  // ✅ 쿠키에서 idToken 가져오기
  const cookieHeader = req.headers.get("cookie");
  const cookies = Object.fromEntries(
    cookieHeader?.split("; ").map((c) => c.split("=")) || []
  );
  const idToken = cookies["idToken"];

  if (!idToken) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  if (!year || !month) {
    return NextResponse.json(
      { error: "연도와 월 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const formattedMonth = month.padStart(2, "0"); // 📌 1월 -> 01월 변환
    const response = await fetch(
      `${API_BASE_URL}/home/calendar/monthread/${year}-${formattedMonth}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${idToken}` },
      }
    );

    if (!response.ok) {
      throw new Error("월별 데이터를 가져오는데 실패했습니다.");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
