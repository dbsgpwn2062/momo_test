"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import styles from "@/styles/platformFilter.module.css"; // 스타일 파일
import { useRouter, useSearchParams } from "next/navigation";

// 플랫폼 타입 정의
interface Platform {
  name: string;
  img: string;
}

// props 타입 정의
interface PlatformFilterProps {
  selectedPlatforms: string[];
  setSelectedPlatforms: React.Dispatch<React.SetStateAction<string[]>>;
}

// ✅ 플랫폼 리스트 (이미지 경로 반영)
const PLATFORMS: Platform[] = [
  { name: "넷플릭스", img: "/icon-ott/icon-netflix.webp" },
  { name: "티빙", img: "/icon-ott/icon-tving.webp" },
  { name: "왓챠", img: "/icon-ott/icon-watcha.webp" },
  { name: "디즈니", img: "/icon-ott/icon-disney+.webp" },
  { name: "웨이브", img: "/icon-ott/icon-wavve.webp" },
  { name: "쿠팡플레이", img: "/icon-ott/icon-coupangplay.webp" },
];

export default function PlatformFilter({
  selectedPlatforms,
  setSelectedPlatforms,
}: PlatformFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePlatformChange = useCallback(
    async (platform: string) => {
      // 먼저 새로운 선택된 플랫폼 배열 생성
      const newSelectedPlatforms = selectedPlatforms.includes(platform)
        ? selectedPlatforms.filter((p) => p !== platform)
        : [...selectedPlatforms, platform];

      // 상태 먼저 업데이트
      setSelectedPlatforms(newSelectedPlatforms);

      // URL 파라미터 구성
      const params = new URLSearchParams(searchParams.toString());
      params.delete("platform"); // 기존 platform 파라미터 제거

      // 새로운 플랫폼 목록 추가
      newSelectedPlatforms.forEach((p) => params.append("platform", p));

      // 검색어 유지
      const query = searchParams.get("q");
      if (query) {
        params.set("q", query);
      }

      // URL 업데이트
      router.push(`/search?${params.toString()}`, { scroll: false });
    },
    [selectedPlatforms, searchParams, router, setSelectedPlatforms]
  );

  return (
    <div className={styles.platformContainer}>
      {PLATFORMS.map(({ name, img }) => (
        <button
          key={name}
          className={`${styles.platformButton} ${
            selectedPlatforms.includes(name) ? styles.selected : ""
          }`}
          onClick={() => handlePlatformChange(name)}
        >
          <Image
            src={img}
            alt={name}
            width={60}
            height={60}
            className={styles.platformImage}
          />
        </button>
      ))}
    </div>
  );
}
