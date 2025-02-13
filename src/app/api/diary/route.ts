import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

// ✅ 쿠키에서 idToken 가져오는 함수
const getTokenFromCookies = (req: NextRequest): string | null => {
  const cookieHeader = req.headers.get("cookie") || "";
  return (
    cookieHeader
      .split("; ")
      .find((row) => row.startsWith("idToken="))
      ?.split("=")[1] || null
  );
};

// ✅ GET - 특정 날짜의 일기 조회
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json(
      { error: "날짜 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  const idToken = getTokenFromCookies(req);
  if (!idToken) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/home/calendar/detail_read/${date}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${idToken}` },
      }
    );

    if (!response.ok) {
      throw new Error("일기 데이터를 가져오는데 실패했습니다.");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}

// ✅ POST - 일기 저장
export async function POST(req: NextRequest) {
  const idToken = getTokenFromCookies(req);
  if (!idToken) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const body = await req.json();

    const response = await fetch(`${API_BASE_URL}/home/calendar/write`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("일기 저장 실패");
    }

    return NextResponse.json({ message: "일기가 성공적으로 저장되었습니다!" });
  } catch (error) {
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  }
}
