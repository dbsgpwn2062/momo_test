const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 회원가입
export const registerUser = async (
  nickname: string,
  email: string,
  password: string,
  password_confirmation: string
) => {
  try {
    const res = await fetch(`${API_BASE_URL}/users/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nickname,
        email,
        password,
        password_confirmation,
      }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return await res.json(); // ✅ 회원가입 성공 시 응답 반환
  } catch (error) {
    console.error("회원가입 요청 실패:", error);
    return null; // 회원가입 실패 시 `null` 반환
  }
};

// 로그인&토큰 저장
export const loginUser = async (email: string, password: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/users/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }), // ✅ email 사용
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json(); // ✅ 응답에서 토큰 가져오기
    if (data.access && data.refresh) {
      sessionStorage.setItem("accessToken", data.access); // ✅ 액세스 토큰 저장
      sessionStorage.setItem("refreshToken", data.refresh); // ✅ 리프레시 토큰 저장
      console.log("세션 스토리지에 토큰 저장 완료:", data);
    } else {
      console.error("토큰이 응답에 없습니다.", data);
    }

    return data;
  } catch (error) {
    console.error("로그인 요청 실패:", error);
    return null;
  }
};
