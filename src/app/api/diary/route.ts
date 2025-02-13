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

// 일기 삭제
export async function DELETE(req: NextRequest) {
  try {
    const token = getTokenFromCookies(req);
    if (!token) {
      console.error("[DELETE] ❌ No ID token found in cookies");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ URL에서 `date` 가져오기
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Missing date parameter" },
        { status: 400 }
      );
    }

    // ✅ Django API URL 구성 (확실한 URL 형식)
    const backendUrl = `${API_BASE_URL}/home/calendar/delete/${date}`;
    console.log(`[DELETE] 🔗 Sending request to backend: ${backendUrl}`);

    const res = await fetch(backendUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `[DELETE] ❌ Backend responded with status ${res.status}:`,
        errorText
      );
      return NextResponse.json(
        { error: "Failed to delete diary entry" },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("[DELETE] ✅ Successfully deleted diary entry:", data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[DELETE] ❌ Error deleting diary entry:", error);
    return NextResponse.json(
      { error: "Failed to delete diary entry" },
      { status: 500 }
    );
  }
}
