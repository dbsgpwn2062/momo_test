"use client";

import { useState, useEffect } from "react";
import ProfileView from "@/components/profile/ProfileView";
import ProfileEdit from "@/components/profile/ProfileEdit";
import Header from "@/components/ui/Header";
import { getTokenFromCookies } from "@/services/auth";
import styles from "@/styles/Profile.module.css";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    nickname: "",
    email: "",
    mbti: "",
    subscribe_platform: [] as string[],
  });

  // ✅ 회원정보 가져오기
  useEffect(() => {
    async function fetchUserInfo() {
      try {
        const idToken = await getTokenFromCookies();
        if (!idToken) throw new Error("No ID token found");

        const tokenPayload = JSON.parse(atob(idToken.split(".")[1])); // JWT 디코딩
        const nickname = tokenPayload["nickname"] || "닉네임 없음";
        const email = tokenPayload["email"] || "이메일 없음";

        const res = await fetch("/api/userinfo");
        if (!res.ok) throw new Error("Failed to fetch user info");

        const data = await res.json();
        setUserInfo({
          nickname,
          email,
          mbti: data.mbti || "",
          subscribe_platform:
            typeof data.subscribe_platform === "string"
              ? data.subscribe_platform.split(",")
              : data.subscribe_platform || [],
        });
      } catch (error) {
        console.error("❌ 회원정보 불러오기 실패:", error);
      }
    }
    fetchUserInfo();
  }, []);

  // ✅ 정보 수정 후 반영하는 함수
  const handleUpdate = (updatedInfo: {
    mbti: string;
    subscribe_platform: string[];
  }) => {
    setUserInfo((prev) => ({
      ...prev,
      mbti: updatedInfo.mbti,
      subscribe_platform: updatedInfo.subscribe_platform,
    }));
    setIsEditing(false); // 저장 후 수정모드 닫기
  };

  return (
    <div className={styles.mainContainer}>
      <Header />
      <div className={styles.container}>
        {isEditing ? (
          <ProfileEdit
            userInfo={userInfo}
            onUpdate={handleUpdate}
            onClose={() => setIsEditing(false)}
          />
        ) : (
          <ProfileView userInfo={userInfo} onEdit={() => setIsEditing(true)} />
        )}
      </div>
    </div>
  );
}
