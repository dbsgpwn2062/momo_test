"use client";
// pages/index.tsx
import ServiceSlider from "@/components/ServiceSlider";
import Link from "next/link";
import Header from "@/components/ui/Header";
import styles from "@/styles/Home.module.css";

const COGNITO_SIGN_UP_URL =
  process.env.NEXT_PUBLIC_COGNITO_DOMAIN +
  `/signup?client_id=${process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID}` +
  `&response_type=code&scope=email+openid+profile` +
  `&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}`;

export default function Home() {
  return (
    <div>
      <Header />

      {/* 헤더 */}
      <header className={styles.header}>
        <h1>AI 기반 감성 일기 & OTT 추천</h1>
        <p>
          일기를 작성하면 감정을 분석하고, 맞춤형 OTT 콘텐츠를 추천해드립니다.
        </p>
      </header>

      {/* 서비스 소개 슬라이드 */}
      <section className={styles.sliderSection}>
        <ServiceSlider />
      </section>

      {/* 주요 기능 소개 */}
      <section className={styles.features}>
        <div className={styles.feature}>
          <h2>✍️ 감성 일기 작성</h2>
          <p>매일 일기를 기록하고 감정을 분석하세요.</p>
        </div>
        <div className={styles.feature}>
          <h2>🎭 AI 감정 분석</h2>
          <p>당신의 감정을 분석하여 패턴을 제공합니다.</p>
        </div>
        <div className={styles.feature}>
          <h2>📺 OTT 콘텐츠 추천천</h2>
          <p>분석된 감정에 맞는 영화를 추천받아 보세요.</p>
        </div>
      </section>

      {/* 회원가입 버튼 */}
      <section className={styles.cta}>
        <Link href={COGNITO_SIGN_UP_URL}>
          <button className={styles.ctaButton}>지금 시작하기</button>
        </Link>
      </section>
    </div>
  );
}
