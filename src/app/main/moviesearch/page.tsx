"use client";

import { useState } from "react";
import SearchBar from "@/components/mainForm/movie/SearchBar";
import MovieGrid from "@/components/mainForm/movie/MovieGrid";
import "@/styles/search.css";

export default function MovieSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <SearchBar onSearch={setSearchQuery} />
      <MovieGrid searchQuery={searchQuery} />
    </div>
  );
}
