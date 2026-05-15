"use client";

import styles from "../Walks.module.css";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import { CloseIconSmall, SearchIcon } from "@/icons/PhosphorIcons";

export default function WalksSearchBar() {
  const searchParams = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState(searchParams.get("query") ?? "");
  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") ?? "");

  useEffect(() => {
    if (inputValue === "") {
      setSearchTerm("");
      return;
    }
    const handler = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 300);
    return () => clearTimeout(handler);
  }, [inputValue]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) params.set("query", searchTerm);
    else params.delete("query");

    window.history.replaceState({}, "", `/walks?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  useEffect(() => {
    const query = searchParams.get("query") ?? "";
    setSearchTerm(query);
    setInputValue(query);
  }, [searchParams]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      searchRef.current?.blur();
      searchRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={styles.searchBar}
      onClick={() => searchRef.current?.focus()}
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
