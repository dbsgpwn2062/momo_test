"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/ui/Header";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopMovies } from "@/components/insight/TopMovies";
import styles from "@/styles/TopMovie.module.css";
import {
  fetchMBTIRecommendations,
  fetchMBTIEmotionStats,
} from "@/services/mbti_top";

interface Movie {
  title: string;
  poster_url: string;
}

interface MBTIMovies {
  [key: string]: Movie[];
}

export default function MBTIStatsPage() {
  const [selectedMBTI, setSelectedMBTI] = useState<string>("");
  const [mbtiMovies, setMbtiMovies] = useState<MBTIMovies>({});
  const [loading, setLoading] = useState(true);
  const [mbtiTypes, setMbtiTypes] = useState<string[]>([]);
  const [mbtiStatsImage, setMbtiStatsImage] = useState<string | null>(null); // 이미지 상태 추가

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await fetchMBTIRecommendations();
        setMbtiMovies(data);
        const types = Object.keys(data);
        setMbtiTypes(types);
        if (types.length > 0) {
          setSelectedMBTI(types[0]);
        }
      } catch (error) {
        console.error("Failed to fetch MBTI movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const loadMBTIStats = async () => {
    try {
      const imageBlob = await fetchMBTIEmotionStats(); // API 호출
      const imageUrl = URL.createObjectURL(imageBlob); // Blob을 URL로 변환
      setMbtiStatsImage(imageUrl); // 상태 업데이트
    } catch (error) {
      console.error("Failed to load MBTI stats:", error);
    }
  };

  useEffect(() => {
    loadMBTIStats(); // 컴포넌트가 마운트될 때 MBTI 통계 로드
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        로딩 중...
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">MBTI별 통계</h1>
          {selectedMBTI && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                현재 선택된 MBTI: {selectedMBTI}입니다.
              </h2>
            </div>
          )}
          {mbtiTypes.length > 0 && (
            <Tabs value={selectedMBTI} onValueChange={setSelectedMBTI}>
              <TabsList className="mb-4 flex flex-wrap gap-2">
                {mbtiTypes.map((type) => (
                  <TabsTrigger
                    key={type}
                    value={type}
                    onValueChange={setSelectedMBTI}
                  >
                    회원님의 MBTI는 {type}입니다.
                  </TabsTrigger>
                ))}
              </TabsList>

              {selectedMBTI && (
                <TopMovies
                  movies={mbtiMovies[selectedMBTI] || []}
                  mbtiType={selectedMBTI}
                />
              )}
            </Tabs>
          )}
          {mbtiStatsImage && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-4">MBTI 감정 통계</h2>
              <img src={mbtiStatsImage} alt="MBTI 감정 통계" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
