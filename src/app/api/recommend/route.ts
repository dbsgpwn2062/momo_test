import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL_BEDROCK;

// ✅ HTTP-only 쿠키에서 idToken 가져오기
const getTokenFromCookies = (req: NextRequest): string | null => {
  const cookieHeader = req.headers.get("cookie") || "";
  return (
    cookieHeader
      .split("; ")
      .find((row) => row.startsWith("idToken="))
      ?.split("=")[1] || null
  );
};

export async function POST(req: NextRequest) {
  try {
    // ✅ 요청 바디에서 날짜(date)와 타입(type) 가져오기
    const { date, type } = await req.json();

    if (!date || !type) {
      return NextResponse.json(
        { error: "날짜(date)와 타입(type)이 필요합니다." },
        { status: 400 }
      );
    }

    // ✅ HTTP-only 쿠키에서 idToken 가져오기
    const token = getTokenFromCookies(req);
    if (!token) {
      return NextResponse.json(
        { error: "인증 토큰이 없습니다." },
        { status: 401 }
      );
    }

    // ✅ 백엔드 API 엔드포인트 설정 (POST 요청)
    const backendUrl = `${API_BASE_URL}/bedrock/${type}/${date}`;
    console.log(`[API 요청] ${backendUrl}`);

    // ✅ 백엔드 API 호출 (POST 방식) + 바디 추가
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ HTTP-only 쿠키에서 가져온 토큰 추가
      },
      body: JSON.stringify({}), // ✅ 요청 바디가 필요 없는 경우, 빈 객체 전달
    });

    // ✅ 응답 처리
    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[ERROR] API 요청 실패:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
