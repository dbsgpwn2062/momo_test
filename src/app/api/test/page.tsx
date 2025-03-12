// app/test/page.tsx

"use client";

import TestCardSlider from "@/components/TestCardSlider";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <h1 className="text-2xl font-bold mb-6">카드 슬라이드 테스트</h1>
      <TestCardSlider />
    </div>
  );
}
