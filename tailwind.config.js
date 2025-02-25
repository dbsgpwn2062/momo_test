module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ 전체 src 폴더 내 파일 검색
    "./app/**/*.{js,ts,jsx,tsx}", // ✅ app 폴더 포함
    "./components/**/*.{js,ts,jsx,tsx}", // ✅ components 폴더 포함
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
