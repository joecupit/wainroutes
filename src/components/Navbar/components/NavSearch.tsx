"use client";

import styles from "../Navbar.module.css";

import { CloseIconSmall, SearchIconBold } from "@/icons/PhosphorIcons";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function NavSearch() {
  const [openSearch, setOpenSearch] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();
  const handleSearch = () => {
    if (searchTerm.trim().length == 0) return;

    router.push(`/walks?query=${encodeURIComponent(searchTerm)}`);
    inputRef.current?.blur();
    setOpenSearch(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const pathname = usePathname();
  useEffect(() => {
    if (openSearch) {
      inputRef.current?.focus();
    } else {
      setSearchTerm("");
    }
  }, [openSearch]);

  useEffect(() => {
    setOpenSearch(false);
  }, [pathname]);

  return (
    <div className={styles.navSearch} data-open={openSearch}>
      <button
        className={styles.navItem}
        onClick={() => setOpenSearch((prev) => !prev)}
        title="Search"
      >
        <SearchIconBold />
      </button>
      <div
        className={styles.navSearchInput}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          ref={inputRef}
          type="text"
          placeholder="Search..."
          onKeyUp={(e) => handleKeyPress(e)}
        />
        <button onClick={() => setOpenSearch((prev) => !prev)}>
          <CloseIconSmall />
        </button>
      </div>
    </div>
  );
}
