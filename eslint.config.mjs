import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    ignores: ["node_modules", "dist", ".next"], // ESLint에서 제외할 폴더 설정
  },
  ...compat.extends("next/core-web-vitals", "next", "next/typescript"), // ✅ 배열 제거
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off", // 사용하지 않는 변수 무시
      "prefer-const": "off", // let 대신 const 사용 강제 비활성화
      "@typescript-eslint/no-explicit-any": "off", // any 타입 사용 가능하게 변경
      "react-hooks/exhaustive-deps": "off", // useEffect 의존성 검사 비활성화
      "@next/next/no-img-element": "off", // <img> 태그 사용 가능하게 변경
    },
  },
];
