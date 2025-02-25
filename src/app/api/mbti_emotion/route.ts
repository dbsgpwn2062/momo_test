import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL_INSIGHT;

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/insight/mbti_all`); // Django API 호출
    if (!response.ok) {
      throw new Error("Failed to fetch MBTI emotion stats");
    }

    const imageBlob = await response.blob(); // 이미지 데이터를 Blob 형태로 가져옴
    return new Response(imageBlob, {
      status: 200,
      headers: {
        "Content-Type": "image/png", // 이미지 타입 설정
      },
    });
  } catch (error) {
    console.error("❌ [GET] MBTI 감정 통계 가져오기 실패:", error);
    return NextResponse.json(
      { error: "MBTI 감정 통계를 가져오는 중 오류 발생" },
      { status: 500 }
    );
  }
}
