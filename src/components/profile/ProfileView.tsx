"use client";

import Image from "next/image";
import styles from "@/styles/Profile.module.css";

const PLATFORM_ICONS: Record<string, string> = {
  티빙: "/icon-ott/icon-tving.webp",
  웨이브: "/icon-ott/icon-wavve.webp",
  쿠팡플레이: "/icon-ott/icon-coupangplay.webp",
  넷플릭스: "/icon-ott/icon-netflix.webp",
  왓챠: "/icon-ott/icon-watcha.webp",
  디즈니플러스: "/icon-ott/icon-disney+.webp",
};

interface ProfileViewProps {
  userInfo: {
    email: string;
    mbti: string;
    subscribe_platform: string[];
  };
  onEdit: () => void;
}

const ProfileView = ({ userInfo, onEdit }: ProfileViewProps) => {
  return (
    <div>
      <h2 className={styles.title}>회원정보 페이지</h2>
      <div className={styles.infoGroup}>
        <label className={styles.label}>Email</label>
        <input
          className={styles.input}
          type="text"
          value={userInfo.email}
          disabled
        />
      </div>

      <div className={styles.infoGroup}>
        <label className={styles.label}>MBTI</label>
        <input
          className={styles.input}
          type="text"
          value={userInfo.mbti || "설정되지 않음"}
          disabled
        />
      </div>

      <div className={styles.platformSection}>
        <h3 className={styles.subtitle}>구독 중인 OTT 플랫폼</h3>
        <div className={styles.platformGrid1}>
          {userInfo.subscribe_platform.map((platform) => (
            <Image
              key={platform}
              src={PLATFORM_ICONS[platform]}
              alt={platform}
              width={60}
              height={60}
            />
          ))}
        </div>
      </div>

      <button className={styles.editButton} onClick={onEdit}>
        회원정보 수정
      </button>
    </div>
  );
};

export default ProfileView;
