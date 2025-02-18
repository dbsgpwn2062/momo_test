const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL_BEDROCK;
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(":수신_봉투: [Next.js] 사용자 입력:", body);
    // :흰색_확인_표시: Django API URL 수정
    const response = await fetch(`${API_BASE_URL}/bedrock/chatbot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      console.error(":x: [Next.js] Django 응답 오류:", response.status);
      return new Response(
        JSON.stringify({ error: `Django 오류: ${response.status}` }),
        { status: 500 }
      );
    }
    const data = await response.json();
    console.log(":흰색_확인_표시: [Next.js] Django 응답:", data);
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error(":x: [Next.js] API 오류:", error);
    return new Response(JSON.stringify({ error: "서버 내부 오류 발생" }), {
      status: 500,
    });
  }
}
