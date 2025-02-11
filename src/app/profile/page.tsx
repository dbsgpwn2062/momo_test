"use client";

import { useEffect, useState } from "react";

export default function Profile() {
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem("userInfo");
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }
  }, []);

  if (!userInfo) {
    return <div>Loading user info...</div>;
  }

  return (
    <div>
      <h2>사용자 정보</h2>
      <p>
        <strong>이름:</strong> {userInfo.name || "이름 없음"}
      </p>
      <p>
        <strong>이메일:</strong> {userInfo.email || "이메일 없음"}
      </p>
      <p>
        <strong>닉네임:</strong> {userInfo.nickname || "닉네임 없음"}
      </p>
      <p>
        <strong>전화번호:</strong> {userInfo.phone_number || "전화번호 없음"}
      </p>
    </div>
  );
}
