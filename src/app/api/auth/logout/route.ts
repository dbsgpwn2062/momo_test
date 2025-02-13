import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

// ✅ [GET] 로그아웃 → 쿠키 삭제 후 홈으로 이동
export async function GET(req: NextRequest) {
  const response = NextResponse.json({ message: "Logged out successfully" });

  // ✅ 토큰 삭제
  response.headers.append(
    "Set-Cookie",
    serialize("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    })
  );

  response.headers.append(
    "Set-Cookie",
    serialize("idToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    })
  );

  return response;
}
