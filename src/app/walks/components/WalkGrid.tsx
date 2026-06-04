"use client";

import styles from "../Walks.module.css";
import buttonStyles from "@/styles/buttons.module.css";

import { useState } from "react";

import WalkCard from "@/components/WalkCard/WalkCard";
import SelectDropdown from "@/components/SelectDropdown/SelectDropdown";

import { locations } from "./WalkFilterValues";
import { useWalkFilters } from "../contexts/WalkFilterContext";
import { GridIcon, ListIcon } from "@/icons/PhosphorIcons";

export default function WalkGrid() {
  const {
    walks,
    filters,
    filterOptions,
    isFiltered,
    totalWalks,
    updateFilter,
    clearFilters,
    showDistances,
    sortValue,
    setSortValue,
    searchTerm,
    flash,
  } = useWalkFilters();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <div className={styles.grid}>
      <div className={styles.gridTop}>
        <div className={styles.gridTopLeft}>
          <p className={styles.gridTopWalkCount}>
            {isFiltered ? (
              <>
                Showing <span>{walks.length}</span> walk
                {walks.length !== 1 ? "s" : ""}{" "}
                {filters.town && locations[filters.town]
                  ? `near ${locations[filters.town]?.name}`
                  : "matching your filters"}
              </>
            ) : (
              <>
                Showing all <span>{totalWalks}</span> walks
              </>
            )}
          </p>
        </div>

        <div className={styles.gridTopRight}>
          <div className={styles.gridTopSort}>
            <p>Sort by</p>
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
            <p className="visually-hidden">View</p>
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

      {searchTerm.toLowerCase().replaceAll(" ", "-") in locations && (
        <div className={styles.searchLocationButton}>
          Search for&nbsp;
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "instant" });
              updateFilter(
                ["query", "town"],
                ["", searchTerm.toLowerCase().replaceAll(" ", "-")],
              );
            }}
            className={`${buttonStyles.button} ${buttonStyles.text}`}
          >
            walks near{" "}
            {locations[searchTerm.toLowerCase().replaceAll(" ", "-")]?.name}
          </button>
        </div>
      )}

      {walks.length === 0 && (
        <div style={{ textAlign: "center" }}>
          No walks match the current filters.&nbsp;
          <button
            style={{ display: "inline" }}
            className={`${buttonStyles.button} ${buttonStyles.text}`}
            onClick={() => clearFilters()}
          >
            Reset filters
          </button>
        </div>
      )}

      <div className={styles.gridGrid} data-view={viewMode} data-flash={flash}>
        {walks.map((walk, index) => {
          return (
            <WalkCard key={index} walk={walk} showDistance={showDistances} />
          );
        })}
      </div>

      {walks.length > 0 && (
        <div className={styles.gridEndText}>
          <p>
            End of walks list (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              title="Scroll to top"
              className={`${buttonStyles.button} ${buttonStyles.text}`}
            >
              back to top
            </button>
            )
          </p>
        </div>
      )}
    </div>
  );
}
