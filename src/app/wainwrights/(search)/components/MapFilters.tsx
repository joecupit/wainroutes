"use client";

import styles from "../sections/MapSection.module.css";
import buttonStyles from "@/styles/buttons.module.css";

import { BookTitles, BookTotals } from "@/types/Hill";
import { displayElevation } from "@/utils/unitConversions";
import { CloseIconSmall, ResetIcon, SearchIcon } from "@/icons/PhosphorIcons";

import { Slider, SliderSingleProps } from "antd";
import { useEffect, useState } from "react";
import { useWainwrights } from "../contexts/WainwrightsContext";

const formatter: NonNullable<SliderSingleProps["tooltip"]>["formatter"] = (
  value,
) => `${value}m`;

export default function MapFilters() {
  const { filters, resetRef, updateFilter, resetFilters } = useWainwrights();

  const [searchTermBuffer, setSearchTermBuffer] = useState(filters.searchTerm);
  useEffect(() => {
    const handler = setTimeout(() => {
      updateFilter("query", searchTermBuffer);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTermBuffer]);
  useEffect(() => {
    if (filters.searchTerm.length == 0) {
      setSearchTermBuffer("");
    }
  }, [filters.searchTerm]);

  const [heightBuffer, setHeightBuffer] = useState(filters.height);
  useEffect(() => {
    const handler = setTimeout(() => {
      updateFilter(
        "height",
        heightBuffer[0] !== 290 || heightBuffer[1] !== 978
          ? heightBuffer.join(",")
          : undefined,
      );
    }, 200);
    return () => clearTimeout(handler);
  }, [heightBuffer]);
  useEffect(() => {
    setHeightBuffer(filters.height);
  }, [filters.height]);

  return (
    <div className={styles.filters}>
      <div className={styles.mapFiltersHeader}>
        <h3>Filter & Search</h3>
        <button onClick={resetFilters}>Clear all</button>
      </div>
      <div className={styles.mapFilters}>
        <div className={styles.searchFilter}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search fells..."
            value={searchTermBuffer}
            onChange={(e) => setSearchTermBuffer(e.target.value)}
          />
          {searchTermBuffer && (
            <button title="Clear" onClick={() => setSearchTermBuffer("")}>
              <CloseIconSmall />
            </button>
          )}
        </div>
        <div>
          <h4>Select region</h4>
          <div className={styles.byRegion}>
            <RadioButton
              name="book"
              value={0}
              active={filters.region === 0}
              onChange={() => updateFilter("region", undefined)}
            >
              All Regions <span>214</span>
            </RadioButton>
            {[1, 2, 3, 4, 5, 6, 7].map((bookId) => (
              <RadioButton
                name="book"
                value={bookId}
                key={bookId}
                active={filters.region === bookId}
                onChange={() => updateFilter("region", String(bookId))}
                bookId={bookId}
              >
                {BookTitles[bookId].slice(4)} <span>{BookTotals[bookId]}</span>
              </RadioButton>
            ))}
          </div>
        </div>
        <div>
          <div className={styles.heightHeader}>
            <h4>Height</h4>
            <button
              onClick={() => {
                setHeightBuffer([290, 978]);
              }}
            >
              reset
            </button>
          </div>
          <Slider
            range
            tooltip={{ formatter }}
            min={290}
            max={978}
            value={heightBuffer}
            onChange={(val) => setHeightBuffer(val)}
            className={styles.heightSlider}
          />
          <div className={styles.heightInputs}>
            <span>{displayElevation(filters.height[0])}</span>
            <span>{displayElevation(filters.height[1])}</span>
            {/* <input
                  type="number"
                  value={heightBuffer[0]}
                  onChange={(e) =>
                    setHeightBuffer((prev) => [Number(e.target.value), prev[1]])
                  }
                />
                <input
                  type="number"
                  value={heightBuffer[1]}
                  onChange={(e) =>
                    setHeightBuffer((prev) => [prev[0], Number(e.target.value)])
                  }
                /> */}
          </div>
        </div>

        <div>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={filters.withWalk}
              onChange={(e) =>
                updateFilter("walk", e.target.checked ? "yes" : undefined)
              }
            />
            Only fells with walks
          </label>
        </div>

        <button
          onClick={resetFilters}
          className={`${buttonStyles.button} ${buttonStyles.muted} ${styles.resetFilters}`}
          ref={resetRef}
        >
          <ResetIcon />
          Reset filters
        </button>
      </div>
    </div>
  );
}

function RadioButton({
  name,
  value,
  children,
  active,
  onChange,
  bookId,
}: {
  name: string;
  value: string | number | undefined;
  children: React.ReactNode;
  active: boolean;
  onChange: CallableFunction;
  bookId?: number;
}) {
  return (
    <label
      className={styles.filterRadio}
      style={
        bookId
          ? ({
              "--_book-color": `var(--clr-wain-book-${bookId})`,
            } as React.CSSProperties)
          : {}
      }
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={active}
        onChange={() => onChange()}
      />
      {children}
    </label>
  );
}
