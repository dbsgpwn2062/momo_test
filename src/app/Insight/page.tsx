// app/mbti/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/ui/Header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TopMovies } from "@/components/insight/TopMovies";
import styles from "@/styles/InsightPage.module.css";
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
  const [mbtiStatsImage, setMbtiStatsImage] = useState<string | null>(null);

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
      const imageBlob = await fetchMBTIEmotionStats();
      const imageUrl = URL.createObjectURL(imageBlob);
      setMbtiStatsImage(imageUrl);
    } catch (error) {
      console.error("Failed to load MBTI stats:", error);
    }
  };

  useEffect(() => {
    loadMBTIStats();
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
        <h1 className={styles.title}>MBTI별 통계</h1>
        {selectedMBTI && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              현재 선택된 MBTI: {selectedMBTI}입니다.
            </h2>
          </div>
        )}
        {mbtiTypes.length > 0 && (
          <TopMovies
            movies={mbtiMovies[selectedMBTI] || []}
            mbtiType={selectedMBTI}
          />
        )}
      </div>
    </>
  );
}
