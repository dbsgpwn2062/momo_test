const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 회원가입
export const registerUser = async (
  username: string,
  email: string,
  password: string,
  password2: string
) => {
  try {
    const res = await fetch(`${API_BASE_URL}/users/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, password2 }),
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
export const loginUser = async (username: string, password: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/users/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json(); // ✅ 응답에서 토큰 가져오기
    if (data.token) {
      sessionStorage.setItem("token", data.token); // ✅ 토큰을 세션 스토리지에 저장
      console.log("세션 스토리지에 토큰 저장 완료:", data.token);
    }

    return data;
  } catch (error) {
    console.error("로그인 요청 실패:", error);
    return null;
  }
};
