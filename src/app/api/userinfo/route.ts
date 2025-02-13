import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// ✅ 쿠키에서 idToken 추출하는 함수
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
  try {
    const token = getTokenFromCookies(req);

    if (!token) {
      console.error("[GET] ❌ No ID token found in cookies");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Django URL과 일치하도록 `/` 제거
    const backendUrl = `${BACKEND_URL}/home/calendar/personal_info`;
    console.log(`[GET] 🔗 Sending request to backend: ${backendUrl}`);

    const res = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `[GET] ❌ Backend responded with status ${res.status}:`,
        errorText
      );
      return NextResponse.json(
        { error: `Failed to fetch user info: ${errorText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("[GET] ✅ Successfully received data from backend:", data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[GET] ❌ Error fetching user info:", error);
    return NextResponse.json(
      { error: "Failed to fetch user info" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromCookies(req);

    if (!token) {
      console.error("[POST] ❌ No ID token found in cookies");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("[POST] 🔹 Request Body:", body);

    // ✅ Django URL과 일치하도록 `/` 제거
    const backendUrl = `${BACKEND_URL}/home/calendar/personal_info`;
    console.log(`[POST] 🔗 Sending request to backend: ${backendUrl}`);

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `[POST] ❌ Backend responded with status ${res.status}:`,
        errorText
      );
      return NextResponse.json(
        { error: `Failed to update user info: ${errorText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("[POST] ✅ Successfully updated user info:", data);
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[POST] ❌ Error updating user info:", error);
    return NextResponse.json(
      { error: "Failed to update user info" },
      { status: 500 }
    );
  }
}
