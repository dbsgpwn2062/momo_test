import { NextRequest, NextResponse } from "next/server";
import { serialize } from "cookie";

const COGNITO_DOMAIN = process.env.NEXT_PUBLIC_COGNITO_DOMAIN!;
const CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID!;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_SECRET!;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI!;

// ✅ [POST]  처리 → Cognito에서 토큰 받아와서 쿠키 저장
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code is missing" },
      { status: 400 }
    );
  }

  try {
    // ✅ Cognito에서 토큰 요청
    const tokenResponse = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error("Failed to fetch tokens");
    }

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token || !tokenData.id_token) {
      throw new Error("Missing tokens in response");
    }

    // ✅ 쿠키에 토큰 저장
    const response = NextResponse.json({ message: "Login successful" });

    response.headers.append(
      "Set-Cookie",
      serialize("accessToken", tokenData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 3600, // 1시간 유지
      })
    );

    response.headers.append(
      "Set-Cookie",
      serialize("idToken", tokenData.id_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 3600,
      })
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to authenticate" },
      { status: 500 }
    );
  }
}
