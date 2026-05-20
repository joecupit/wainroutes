"use client";

import styles from "../Walks.module.css";

import type { SimpleWalk } from "../page";
import { WalkFiltersProvider } from "../contexts/WalkFilterContext";

import WalkSearchAndFilter from "./WalkSearchAndFilter";
import WalkGrid from "./WalkGrid";

export default function WalksClient({ allWalks }: { allWalks: SimpleWalk[] }) {
  return (
    <div className={styles.main}>
      <WalkFiltersProvider allWalks={allWalks}>
        <WalkSearchAndFilter />
        <WalkGrid />
      </WalkFiltersProvider>
    </div>
  );
}
