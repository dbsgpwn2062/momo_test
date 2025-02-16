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
  "/emotion/sadness.png": "슬픔",
  "/emotion/satisfaction.png": "만족",
  "/emotion/frustration.png": "좌절",
  "/emotion/annoyance.png": "짜증",
  "/emotion/surprise.png": "놀람",
  "/emotion/anxiety.png": "불안",
  "/emotion/joy.png": "기쁨",
  "/emotion/happy.png": "행복",
  "/emotion/exciting.png": "신남",
  "/emotion/love.png": "사랑",
  "/emotion/gloom.png": "우울",
  "/emotion/neutral.png": "평범",

  // ✅ 일상 (변경 없음)
  "/daily/cat.png": "고양이",
  "/daily/coffee.png": "커피",
  "/daily/dog.png": "강아지",
  "/daily/meal.png": "식사",
  "/daily/music.png": "음악감상",
  "/daily/rest.png": "휴식",
  "/daily/study.png": "공부",
  "/daily/walk.png": "산책",
  "/daily/win.png": "입상",
  "/daily/work.png": "업무",

  // ✅ **활동 (업데이트된 이모지)**
  "/activity/baseball.png": "야구",
  "/activity/bicycle.png": "자전거",
  "/activity/drawing.png": "드로잉",
  "/activity/game.png": "게임",
  "/activity/golf.png": "골프",
  "/activity/movie.png": "영화감상",
  "/activity/sing.png": "노래",
  "/activity/soccer.png": "축구",
  "/activity/swim.png": "수영",
  "/activity/travel.png": "여행",
  "/activity/winter_activity.png": "겨울활동",
};

export const convertEmojiToText = (emojiList: string[]): string[] => {
  return emojiList.map((emoji) => emojiMappings[emoji] || emoji);
};
