"use client";

import styles from "../Walks.module.css";

import { useState } from "react";

import WalkCard from "@/components/WalkCard/WalkCard";
import SelectDropdown from "@/components/SelectDropdown/SelectDropdown";

import { useWalkFilters } from "../contexts/WalkFilterContext";
import { GridIcon, ListIcon } from "@/icons/PhosphorIcons";

export default function WalkGrid() {
  const {
    walks,
    filterOptions,
    isFiltered,
    clearFilters,
    showDistances,
    sortValue,
    setSortValue,
  } = useWalkFilters();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className={styles.grid}>
      <div className={styles.gridTop}>
        <div className={styles.gridTopLeft}>
          <p className={styles.bold}>
            {`Showing${isFiltered ? "" : " all"} ${walks.length} walk${walks.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        <div className={styles.gridTopRight}>
          <div>
            <p>Sort by:</p>
            <SelectDropdown
              value={sortValue}
              onChange={setSortValue}
              label="Sort"
              options={
                showDistances
                  ? { closest: "Closest", ...filterOptions.sort }
                  : filterOptions.sort
              }
            />
          </div>
          <div className={styles.gridRadios}>
            <p>View:</p>
            <div className={styles.gridRadioGroup}>
              <label className={styles.gridRadio}>
                <input
                  type="radio"
                  name="view"
                  value="grid"
                  checked={viewMode == "grid"}
                  onChange={() => setViewMode("grid")}
                />
                <GridIcon />
              </label>
              <label className={styles.gridRadio}>
                <input
                  type="radio"
                  name="view"
                  value="list"
                  checked={viewMode == "list"}
                  onChange={() => setViewMode("list")}
                />
                <ListIcon />
              </label>
            </div>
          </div>
        </div>
      </div>

      {walks.length === 0 && (
        <div className={styles.gridEndText}>
          <>
            No walks match the current filters.&nbsp;
            <button onClick={() => clearFilters()}>Clear filters</button>
          </>
        </div>
      )}

      <div className={styles.gridGrid} data-view={viewMode}>
        {walks.map((walk, index) => {
          return (
            <WalkCard key={index} walk={walk} showDistance={showDistances} />
          );
        })}
      </div>

      {walks.length > 0 && (
        <p className={styles.gridEndText}>
          End of walks list.&nbsp;
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            title="Scroll to top"
          >
            Back to top
          </button>
          .
        </p>
      )}
    </div>
  );
}
