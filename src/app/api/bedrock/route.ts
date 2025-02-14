import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // ✅ JSON 요청 데이터 받기
    const { message } = await req.json();
    if (!message) {
      console.error("❌ 요청 본문이 비어 있습니다.");
      return NextResponse.json({ error: "입력된 메시지가 없습니다." }, { status: 400 });
    }

    console.log("🔹 Django API로 요청:", message);

    // ✅ Django API로 요청 보내기
    const response = await fetch("http://127.0.0.1:8000/api/bedrock/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Django 서버 오류: ${response.status}`);
    }

    const data = await response.json();
    console.log("🔹 Django 응답:", data);
    
    return NextResponse.json({ response: data.response });

  } catch (error) {
    console.error("❌ Django API 호출 오류:", error);
    return NextResponse.json({ error: "Django API 호출 실패" }, { status: 500 });
  }
}
