/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // 독립 실행형 출력
  images: {
    unoptimized: true, // 이미지 최적화 비활성화 (선택사항)
  },
  // 이미지 경로가 제대로 처리되도록 basePath 설정
  basePath: "",
  assetPrefix: "",
};

module.exports = nextConfig;
