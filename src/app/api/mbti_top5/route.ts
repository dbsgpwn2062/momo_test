import { NextResponse } from "next/server";

interface Content {
  title: string;
  poster_url: string;
}

interface MBTIContents {
  [mbtiType: string]: Content[];
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL_INSIGHT;

export async function GET() {
  try {
    if (!BACKEND_URL) {
      throw new Error("Backend URL is not defined");
    }

    // URL 확인을 위한 로그
    console.log("Requesting URL:", `${BACKEND_URL}/insight/mbti_top5_contents`);

    const response = await fetch(`${BACKEND_URL}/insight/mbti_top5_contents`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.API_TOKEN && {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        }),
      },
      cache: "no-store",
    });

    // 응답 상태 확인
    console.log("Response status:", response.status);
    console.log("Response URL:", response.url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`Failed to fetch: ${response.status} ${errorText}`);
    }

    const data: MBTIContents = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
