"use client";

import styles from "../Walks.module.css";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { SimpleWalk } from "../page";
import WalkCard from "@/components/WalkCard/WalkCard";
import { CloseIconSmall, GridIcon, ListIcon } from "@/icons/PhosphorIcons";

import SortDropdown from "./SelectDropdown";

type WalkGridProps = {
  walks: SimpleWalk[];
  clearFilters: CallableFunction;
  showDistances: boolean;
  isFiltered: boolean;
};

export default function WalkGrid({
  walks,
  clearFilters,
  showDistances,
  isFiltered,
}: WalkGridProps) {
  const updateParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value.length > 0) params.set(key, value);
    else params.delete(key);

    window.history.replaceState({}, "", `/walks?${params.toString()}`);
  };

  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const sortOptions = {
    "recommended": "Recommended",
    "recent": "Recently Added",
    "hills-dsc": "Most Wainwrights",
    "hills-asc": "Least Wainwrights",
    "dist-dsc": "Longest",
    "dist-asc": "Shortest",
    "ele-dsc": "Most Elevation",
    "ele-asc": "Least Elevation",
  };

  const [sortValue, setSortValue] = useState(
    searchParams.get("sort") ?? "recommended",
  );

  useEffect(() => {
    if (sortValue !== "recommended") {
      updateParam("sort", sortValue);
    } else {
      updateParam("sort");
    }
  }, [sortValue]);

  useEffect(() => {
    if (showDistances && sortValue === "recommended") {
      setSortValue("closest");
    } else if (!showDistances && sortValue === "closest") {
      setSortValue("recommended");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDistances]);

  const sortedWalks = useMemo(() => {
    const newWalkData = [...walks];

    const [type, dir] = sortValue.split("-");
    switch (type) {
      case "closest":
        newWalkData.sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));
        break;
      case "recent":
        newWalkData.sort(
          (a, b) =>
            new Date(b.date ?? "").getTime() - new Date(a.date ?? "").getTime(),
        );
        break;
      case "hills":
        newWalkData.sort(
          (a, b) => (a.wainwrights?.length ?? 0) - (b.wainwrights?.length ?? 0),
        );
        break;
      case "ele":
        newWalkData.sort((a, b) => (a.elevation ?? 0) - (b.elevation ?? 0));
        break;
      case "dist":
        newWalkData.sort((a, b) => (a.length ?? 0) - (b.length ?? 0));
        break;
      default:
        newWalkData
          .sort((a, b) => a.title.localeCompare(b.title))
          .sort(
            (a, b) => (b.recommendedScore ?? 0) - (a.recommendedScore ?? 0),
          );
        break;
    }

    if (dir === "dsc") newWalkData.reverse();

    return newWalkData;
  }, [walks, sortValue]);

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
            <SortDropdown
              value={sortValue}
              onChange={setSortValue}
              label="Sort"
              options={
                showDistances
                  ? { closest: "Closest", ...sortOptions }
                  : sortOptions
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
        {sortedWalks.map((walk, index) => {
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

function FilterTag({
  Icon,
  text,
  reset,
}: {
  Icon: React.ReactNode;
  text?: string;
  reset?: CallableFunction;
}) {
  if (text === undefined) return <></>;
  else
    return (
      <li>
        <div>
          {Icon}
          {text}
        </div>
        <button
          onClick={() => {
            if (reset) reset();
          }}
          title="Remove filter"
        >
          <CloseIconSmall />
        </button>
      </li>
    );
}
