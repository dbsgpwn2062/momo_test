"use client";

import { useState } from "react";
import styles from "@/styles/SearchBar.module.css";

export default function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="콘텐츠 검색..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.searchInput}
      />
      <button className={styles.searchButton}>🔍</button>
    </div>
  );
}
