"use client";

import Chatbot from "@/components/mainForm/chatbot/Chatbot";
import StatisticsCard from "@/components/mainForm/Statistics/StatisticsCard";
import Image from "next/image";
import { useRouter } from "next/navigation"; // ✅ Next.js 라우터 추가

const emotionData = [
    { title: "행복한", movies: ["해피 무비", "웃음 가득 영화", "힐링 드라마"] },
    { title: "설레는", movies: ["로맨틱 영화", "연애 이야기", "첫사랑 영화"] },
];

export default function MainPage() {
    const router = useRouter(); // ✅ 라우터 설정

    return (
        <div className="main-container">
            {/* 🌟 momo.png 로고 (왼쪽 상단) */}
            <Image 
                src="/momo.png" 
                alt="Momo Logo" 
                width={80} 
                height={80} 
                className="momo-logo"
            />

            {/* 🌟 Home 버튼 (우측 상단 대각선) */}
            <button className="home-button" onClick={() => router.push("/main")}>
                Home
            </button>

            {/* 감정별 콘텐츠 차트 (왼쪽) */}
            <div className="stats-section">
                {emotionData.map((data, index) => (
                    <StatisticsCard key={index} title={data.title} movies={data.movies} />
                ))}
            </div>

            {/* 챗봇 UI (오른쪽) */}
            <div className="chatbot-section">
                <Chatbot />
            </div>
        </div>
    );
}
