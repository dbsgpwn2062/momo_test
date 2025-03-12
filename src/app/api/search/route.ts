import { NextRequest, NextResponse } from "next/server";

interface ElasticsearchQuery {
  size: number;
  from: number;
  track_total_hits: true;
  query: {
    bool: {
      must: Array<{
        multi_match?: {
          query: string;
          fields: string[];
          fuzziness: string;
          operator: string;
          type: string;
        };
        match_all?: {};
      }>;
      should?: Array<{
        match: {
          platform: string;
        };
      }>;
      minimum_should_match: number;
    };
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "0");
    const selectedPlatforms = searchParams.getAll("platform");

    const ELASTICSEARCH_HOST = process.env.NEXT_PUBLIC_ELASTICSEARCH_HOST!;
    const INDEX = process.env.NEXT_PUBLIC_ELASTICSEARCH_INDEX!;
    const url = `${ELASTICSEARCH_HOST}/${INDEX}/_search`;

    const PAGE_SIZE = 25;
    const from = page * PAGE_SIZE;

    // 쿼리 구성
    const query: ElasticsearchQuery = {
      size: PAGE_SIZE,
      from: from,
      track_total_hits: true,
      query: {
        bool: {
          must: [
            q
              ? {
                  multi_match: {
                    query: q,
                    fields: ["title^3", "synopsis^2", "genre"],
                    fuzziness: "AUTO",
                    operator: "or",
                    type: "most_fields",
                  },
                }
              : {
                  match_all: {},
                },
          ],
          should:
            selectedPlatforms.length > 0
              ? selectedPlatforms.map((platform) => ({
                  match: {
                    platform: platform,
                  },
                }))
              : undefined,
          minimum_should_match: selectedPlatforms.length > 0 ? 1 : 0,
        },
      },
    };

    console.log("Elasticsearch Query:", JSON.stringify(query, null, 2));

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Elasticsearch error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch data from Elasticsearch" },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Elasticsearch Response:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 }
    );
  }
}
