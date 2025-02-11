// utils/emojiMappings.ts
export const emojiMappings: Record<string, string> = {
  // ✅ 날씨
  "/weather/cloud.png": "흐림",
  "/weather/rain.png": "비",
  "/weather/snow.png": "눈",
  "/weather/sun.png": "맑음",
  "/weather/thunder.png": "천둥번개",
  "/weather/wind.png": "바람",

  // ✅ 감정
  "/emotion/happy.png": "행복",
  "/emotion/crying.png": "슬픔",
  "/emotion/confusion.png": "혼란",
  "/emotion/scared.png": "두려움",
  "/emotion/shame.png": "수치심",
  "/emotion/love.png": "사랑",
  "/emotion/angry.png": "화남",

  // ✅ 일상
  "/daily/book.png": "독서",
  "/daily/music.png": "음악 감상",
  "/daily/meal.png": "식사",
  "/daily/shopping.png": "쇼핑",
  "/daily/studying.png": "공부",

  // ✅ 활동
  "/activity/dog-walking.png": "강아지 산책",
  "/activity/jogging.png": "조깅",
  "/activity/movie.png": "영화",
  "/activity/sports.png": "운동",
  "/activity/travel.png": "여행",
};

export const convertEmojiToText = (emojiList: string[]): string[] => {
  return emojiList.map((emoji) => emojiMappings[emoji] || emoji);
};
