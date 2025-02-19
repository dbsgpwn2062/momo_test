"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styles from "@/styles/LoadingPopup.module.css";

// Lottie를 서버에서 제외
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const LoadingPopup = ({ isOpen }: { isOpen: boolean }) => {
  const [animationData, setAnimationData] = useState<any | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    import("@../../public/animations/loading.json")
      .then((data) => {
        // JSON 객체를 깊은 복사하여 변경 가능하게 만듦
        const clonedData = structuredClone(data.default);
        setAnimationData(clonedData);
      })
      .catch((err) => console.error("❌ JSON 파일 로드 실패:", err));
  }, []);

  if (!isOpen || !isClient || !animationData) return null;

  return (
    <div className={styles["loading-popup"]}>
      <div className={styles["popup-content"]}>
        <Lottie animationData={animationData} loop={true} />
        <p>momo가 답변을 작성 중이예요...</p>
      </div>
    </div>
  );
};

export default LoadingPopup;
