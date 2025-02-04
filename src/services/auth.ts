// 회원가입
export const registerUser = async (
  username: string,
  email: string,
  password: string,
  password2: string
) => {
  try {
    const res = await fetch("http://127.0.0.1:8000/users/register/", {
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

// 로그인
export const loginUser = async (username: string, password: string) => {
  try {
    const res = await fetch("http://127.0.0.1:8000/users/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    return await res.json(); // ✅ 로그인 성공 시 응답 반환
  } catch (error) {
    console.error("로그인 요청 실패:", error);
    return null; // 로그인 실패 시 `null` 반환
  }
};
