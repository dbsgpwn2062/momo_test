"use client";

import { useState } from "react";
import "@/styles/search.css"; // ✅ CSS 적용

export default function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");

  return (
    <div className="search-wrapper">
      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Movie Title ..."
          className="search-input"
        />
        <button onClick={() => onSearch(query)} className="search-btn">
          Search
        </button>
      </div>
    </div>
  );
}
