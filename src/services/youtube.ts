// API 키 배열 생성
const YOUTUBE_API_KEYS = [
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY1,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY2,
  process.env.NEXT_PUBLIC_YOUTUBE_API_KEY3,
].filter(Boolean) as string[]; // null이나 undefined 제거

let currentKeyIndex = 0;

// 다음 API 키를 가져오는 함수
const getNextApiKey = () => {
  const key = YOUTUBE_API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % YOUTUBE_API_KEYS.length;
  return key;
};

interface YouTubeSearchResult {
  videoId: string;
  title: string;
}

export const searchYoutubeTrailer = async (
  movieTitle: string
): Promise<YouTubeSearchResult> => {
  let lastError: Error | null = null;

  // 모든 API 키를 시도
  for (let i = 0; i < YOUTUBE_API_KEYS.length; i++) {
    const apiKey = getNextApiKey();

    try {
      console.log("🎬 YouTube 예고편 검색 시작:", movieTitle);

      const query = `${movieTitle} 예고편 trailer`;
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          query
        )}&type=video&maxResults=10&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`YouTube API 호출 실패: ${response.status}`);
      }

      const data = await response.json();

      // short 영상 제외하고 첫 번째 영상 찾기
      const firstNonShortVideo = data.items.find(
        (item: any) => !item.snippet.title.toLowerCase().includes("#shorts")
      );

      if (!firstNonShortVideo) {
        throw new Error("적절한 예고편을 찾을 수 없습니다.");
      }

      console.log(
        "✅ YouTube 예고편 검색 성공:",
        firstNonShortVideo.snippet.title
      );

      return {
        videoId: firstNonShortVideo.id.videoId,
        title: firstNonShortVideo.snippet.title,
      };
    } catch (error) {
      console.error(`❌ YouTube API 키 ${i + 1} 실패:`, error);
      lastError = error as Error;

      // 할당량 초과가 아닌 다른 에러라면 바로 throw
      if (error instanceof Error && !error.message.includes("quota")) {
        throw error;
      }

      // 마지막 API 키까지 실패했다면 에러 throw
      if (i === YOUTUBE_API_KEYS.length - 1) {
        throw new Error("모든 YouTube API 키가 실패했습니다.");
      }

      // 다음 API 키로 계속 시도
      continue;
    }
  }

  throw lastError || new Error("YouTube 검색 실패");
};
