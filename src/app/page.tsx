"use client";
// pages/index.tsx
import ServiceSlider from "@/components/ServiceSlider";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      {/* 헤더 */}
      <header className="header">
        <h1>AI 기반 감성 일기 & OTT 추천</h1>
        <p>
          일기를 작성하면 감정을 분석하고, 맞춤형 OTT 콘텐츠를 추천해드립니다.
        </p>
      </header>

      {/* 서비스 소개 슬라이드 */}
      <section className="slider-section">
        <ServiceSlider />
      </section>

      {/* 주요 기능 소개 */}
      <section className="features">
        <div className="feature">
          <h2>✍️ 감성 일기 작성</h2>
          <p>매일 일기를 기록하고 감정을 분석하세요.</p>
        </div>
        <div className="feature">
          <h2>🎭 AI 감정 분석</h2>
          <p>당신의 감정을 분석하여 패턴을 제공합니다.</p>
        </div>
        <div className="feature">
          <h2>📺 OTT 콘텐츠 추천</h2>
          <p>분석된 감정에 맞는 영화를 추천받아 보세요.</p>
        </div>
      </section>

      {/* 회원가입 버튼 */}
      <section className="cta">
        <Link href="/signup">
          <button>지금 시작하기</button>
        </Link>
      </section>

      {/* 스타일 */}
      <style jsx>{`
        .header {
          text-align: center;
          padding: 40px 20px;
        }
        .slider-section {
          max-width: 800px;
          margin: 0 auto;
        }
        .features {
          display: flex;
          justify-content: center;
          gap: 20px;
          padding: 40px;
        }
        .feature {
          flex: 1;
          text-align: center;
          padding: 20px;
          background: #f9f9f9;
          border-radius: 10px;
        }
        .cta {
          text-align: center;
          margin: 40px 0;
        }
        .cta button {
          padding: 15px 30px;
          font-size: 18px;
          background: #ff5733;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
