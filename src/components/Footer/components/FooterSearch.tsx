"use client";

import styles from "../Footer.module.css";

import { CloseIconSmall } from "@/icons/PhosphorIcons";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function FooterSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const handleSearch = () => {
    if (searchTerm.trim().length == 0) return;

    router.push(`/walks?query=${encodeURIComponent(searchTerm)}`);
    inputRef.current?.blur();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const pathname = usePathname();
  useEffect(() => {
    setSearchTerm("");
  }, [pathname]);

  return (
    <div className={styles.footerSearch}>
      <div
        className={styles.footerSearchInput}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          type="text"
          ref={inputRef}
          placeholder="Search..."
          autoCorrect="off"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck="false"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyUp={(e) => handleKeyPress(e)}
        />
        {searchTerm.length > 0 && (
          <button onClick={() => setSearchTerm("")}>
            <CloseIconSmall />
          </button>
        )}
      </div>
    </div>
  );
}
