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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "날짜가 필요합니다." }, { status: 400 });
  }

  // ✅ 쿠키에서 idToken 가져오기
  const cookieHeader = req.headers.get("cookie");
  const cookies = Object.fromEntries(
    cookieHeader?.split("; ").map((c) => c.split("=")) || []
  );
  const idToken = cookies["idToken"];

  if (!idToken) {
    return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/bedrock/response/${date}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API 호출 실패 (HTTP ${response.status})`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ [GET] 추천 데이터 가져오기 실패:", error);
    return NextResponse.json(
      { error: "추천 데이터를 가져오는 중 오류 발생" },
      { status: 500 }
    );
  }
}
