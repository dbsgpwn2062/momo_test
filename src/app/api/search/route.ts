import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const page = parseInt(searchParams.get("page") || "0");

  if (!q) {
    return NextResponse.json(
      { error: "Query parameter 'q' is required" },
      { status: 400 }
    );
  }

  const ELASTICSEARCH_HOST = process.env.NEXT_PUBLIC_ELASTICSEARCH_HOST!;
  const INDEX = process.env.NEXT_PUBLIC_ELASTICSEARCH_INDEX!;
  const url = `${ELASTICSEARCH_HOST}/${INDEX}/_search`;

  const PAGE_SIZE = 25;
  const from = page * PAGE_SIZE;

  const query = {
    size: PAGE_SIZE,
    from: from,
    query: {
      multi_match: {
        query: q,
        fields: ["title^4", "genre^2", "platform^3"],
        operator: "OR",
      },
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch data from Elasticsearch" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch search results" },
      { status: 500 }
    );
  }
}
