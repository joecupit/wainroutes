"use client";

import styles from "./HomeSearchBar.module.css";
import buttonStyles from "@/styles/buttons.module.css";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowRightIcon,
  CloseIconSmall,
  SearchIcon,
} from "@/icons/PhosphorIcons";

export default function HomeSearchBar({
  placeholder,
  className,
}: {
  placeholder?: string;
  className?: string;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const handleSearch = () => {
    if (searchTerm.trim().length == 0) router.push("/walks");

    router.push(`/walks?query=${encodeURIComponent(searchTerm)}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={`${styles.search} ${className ?? ""}`}>
      <div
        className={styles.searchBar}
        onClick={() => inputRef.current?.focus()}
      >
        <SearchIcon />
        <input
          ref={inputRef}
          type="text"
          placeholder={
            placeholder ? placeholder : "Search walks or Wainwrights..."
          }
          value={searchTerm}
          onKeyUp={(e) => handleKeyPress(e)}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm.length > 0 && (
          <button onClick={() => setSearchTerm("")} title="Clear text">
            <CloseIconSmall />
          </button>
        )}
      </div>

      <button
        className={`${buttonStyles.button} ${buttonStyles.primary}`}
        onClick={handleSearch}
      >
        <span className={styles.searchButtonText}>Find walks</span>
        <ArrowRightIcon />
      </button>
    </div>
  );
}
