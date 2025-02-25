"use client";

import { useState } from "react";
import MBTIPopup from "@/components/profile/MBTIPopup";
import Image from "next/image";
import styles from "@/styles/Profile.module.css";

interface ProfileEditProps {
  userInfo: {
    nickname: string;
    email: string;
    mbti: string;
    subscribe_platform: string[] | string;
  };
  onClose: () => void;
  onUpdate: (updatedInfo: {
    mbti: string;
    subscribe_platform: string[];
  }) => void; // ✅ 추가
}

const PLATFORM_ICONS: Record<string, string> = {
  티빙: "/icon-ott/icon-tving.webp",
  웨이브: "/icon-ott/icon-wavve.webp",
  쿠팡플레이: "/icon-ott/icon-coupangplay.webp",
  넷플릭스: "/icon-ott/icon-netflix.webp",
  왓챠: "/icon-ott/icon-watcha.webp",
  디즈니플러스: "/icon-ott/icon-disney+.webp",
};

const PLATFORM_LABELS: Record<string, string> = {
  티빙: "티빙",
  웨이브: "웨이브",
  쿠팡플레이: "쿠팡\n플레이",
  넷플릭스: "넷플릭스",
  왓챠: "왓챠",
  디즈니플러스: "디즈니+",
};

const ProfileEdit = ({ userInfo, onClose, onUpdate }: ProfileEditProps) => {
  const [mbti, setMbti] = useState(userInfo.mbti);
  const [isMBTIPopupOpen, setIsMBTIPopupOpen] = useState(false);

  // ✅ 구독 플랫폼을 문자열에서 배열로 변환
  const initialPlatforms = Array.isArray(userInfo.subscribe_platform)
    ? userInfo.subscribe_platform
    : userInfo.subscribe_platform.split(",");

  const [platforms, setPlatforms] = useState<string[]>(initialPlatforms);
  const [message, setMessage] = useState("");

  // ✅ MBTI 팝업에서 선택한 값 반영
  const handleMBTISelect = (selectedMBTI: string) => {
    setMbti(selectedMBTI);
    setIsMBTIPopupOpen(false);
  };

  // ✅ OTT 플랫폼 선택 토글
  const handlePlatformChange = (platform: string) => {
    setPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  // ✅ 저장하기 버튼 클릭 시 API 요청 및 데이터 업데이트
  async function handleUpdate() {
    setMessage("");
    try {
      const res = await fetch("/api/userinfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mbti,
          subscribe_platform: platforms.join(","), // ✅ 배열 → 문자열 변환
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      setMessage("✅ 정보가 업데이트되었습니다!");

      // ✅ 부모 컴포넌트(ProfilePage)로 변경된 데이터 전달 → 리렌더링 반영
      onUpdate({ mbti, subscribe_platform: platforms });

      setTimeout(onClose, 1000);
    } catch (error) {
      setMessage("❌ 오류 발생!");
    }
  }

  return (
    <div>
      <h2 className={styles.title}>회원정보 수정</h2>

      {/* ✅ Email 필드 */}
      <div className={styles.infoGroup}>
        <label className={styles.label}>Email</label>
        <input
          className={styles.input}
          type="text"
          value={userInfo.email}
          disabled
        />
      </div>

      {/* ✅ MBTI 필드 (입력란 스타일 통일) */}
      <div className={styles.infoGroup}>
        <label className={styles.label}>MBTI</label>
        <input
          className={styles.input}
          type="text"
          value={mbti}
          readOnly
          onClick={() => setIsMBTIPopupOpen(true)}
        />
      </div>

      {isMBTIPopupOpen && (
        <MBTIPopup
          onClose={() => setIsMBTIPopupOpen(false)}
          onSelect={handleMBTISelect}
        />
      )}

      {/* ✅ OTT 플랫폼 선택 */}
      <div className={styles.platformSection}>
        <h3 className={styles.subtitle}>구독 중인 OTT 플랫폼</h3>
        <div className={styles.platformGrid}>
          {Object.keys(PLATFORM_ICONS).map((platform) => (
            <div
              key={platform}
              className={`${styles.platformCard} ${
                platforms.includes(platform) ? styles.selected : ""
              }`}
              onClick={() => handlePlatformChange(platform)}
            >
              <Image
                src={PLATFORM_ICONS[platform]}
                alt={platform}
                width={60}
                height={60}
              />
              <p className={styles.platformLabel}>
                {PLATFORM_LABELS[platform]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ 저장 및 취소 버튼 */}
      <div className={styles.buttonContainer}>
        <button className={styles.editButton} onClick={handleUpdate}>
          저장하기
        </button>
        <button className={styles.editButton} onClick={onClose}>
          취소
        </button>
      </div>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default ProfileEdit;
