"use client";

import { useState, useEffect } from "react";
import LoadingPopup from "@/components/ui/LoadingPopup";

const LoadingPage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 30000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <LoadingPopup isOpen={isLoading} />
      {!isLoading && <h1 className="text-2xl font-bold">페이지 로딩 완료!</h1>}
    </div>
  );
};

export default LoadingPage;
