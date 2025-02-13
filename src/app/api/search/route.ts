import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "0"); // ✅ 페이지 번호 (기본값 0)

  if (!q) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  // ✅ Elasticsearch 서버 설정
  const ELASTICSEARCH_HOST = "http://192.168.2.168:9200";
  const INDEX = "movies";
  const url = `${ELASTICSEARCH_HOST}/${INDEX}/_search`;

  // ✅ 페이지당 50개씩 로드
  const PAGE_SIZE = 48;
  const from = page * PAGE_SIZE;

  // ✅ Elasticsearch Query DSL (Title, Genre, Platform, Synopsis)
  const query = {
    size: PAGE_SIZE,
    from: from,  // ✅ 몇 번째 데이터부터 가져올지 설정
    query: {
      multi_match: {
        query: q,
        fields: [
          "Title^4",      // ✅ 가중치 4 (제목 우선 검색)
          "Genre^2",      // ✅ 가중치 2 (장르 검색)
          "Platform^3",   // ✅ 가중치 3 (플랫폼 검색)
        ],
        operator: "OR"
      }
    }
  };

  try {
    console.log("🔄 Sending request to:", url);
    console.log("📦 Query:", JSON.stringify(query, null, 2));

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    });

    if (!response.ok) {
      console.error(`❌ Elasticsearch Error: ${response.status} - ${response.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch data from Elasticsearch. Status: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("✅ Response from Elasticsearch:", JSON.stringify(data, null, 2));
    return NextResponse.json(data);
  } catch (error) {
    console.error("🚨 Elasticsearch Request Failed:", error);
    return NextResponse.json({ error: "Failed to fetch search results" }, { status: 500 });
  }
}