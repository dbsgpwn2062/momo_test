import { NextRequest, NextResponse } from "next/server";

// ✅ 서버에서 HttpOnly 쿠키 읽기
export async function GET(req: NextRequest) {
  const cookieHeader = req.headers.get("cookie") || "";
  const idToken =
    cookieHeader
      .split("; ")
      .find((row) => row.startsWith("idToken="))
      ?.split("=")[1] || null;

  return NextResponse.json({ idToken });
}
