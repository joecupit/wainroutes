"use client";

import styles from "../Walks.module.css";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useWalkFilters } from "../contexts/WalkFilterContext";
import { CloseIconSmall, SearchIcon } from "@/icons/PhosphorIcons";

export default function WalksSearchBar() {
  const searchParams = useSearchParams();

  const { searchRef, updateFilter } = useWalkFilters();
  const [inputValue, setInputValue] = useState(searchParams.get("query") ?? "");

  useEffect(() => {
    if (inputValue === "") {
      updateFilter("query", "");
      return;
    }
    const handler = setTimeout(() => {
      updateFilter("query", inputValue);
    }, 300);
    return () => clearTimeout(handler);
  }, [inputValue]);

  useEffect(() => {
    const query = searchParams.get("query") ?? "";
    setInputValue(query);
  }, [searchParams]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchRef?.current?.blur();
      searchRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={styles.searchBar}
      onClick={() => searchRef?.current?.focus()}
    >
      <SearchIcon />
      <input
        type="text"
        ref={searchRef}
        placeholder="Search walks or Wainwrights..."
        autoCorrect="off"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck="false"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyUp={(e) => handleKeyPress(e)}
      />
      {inputValue.length > 0 && (
        <button
          className={styles.searchBarButton}
          onClick={() => setInputValue("")}
          title="Clear text"
        >
          <CloseIconSmall />
        </button>
      )}
    </div>
  );
}
