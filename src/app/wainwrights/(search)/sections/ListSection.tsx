"use client";

import styles from "./ListSection.module.css";
import buttonStyles from "@/styles/buttons.module.css";

import Link from "next/link";
import {
  useWainwrights,
  type SimplifiedHill,
} from "../contexts/WainwrightsContext";
import { displayElevation } from "@/utils/unitConversions";
import { BookTitles } from "@/types/Hill";
import { CloseIconSmall, RightIcon } from "@/icons/PhosphorIcons";
import { useMemo } from "react";

export default function ListSection({}: { simplifiedHills: SimplifiedHill[] }) {
  const { filters, isFiltered, filteredHills, updateFilter } = useWainwrights();

  const simplifiedHills = useMemo(() => {
    return filteredHills.sort((a, b) => b.height - a.height);
  }, [filteredHills]);

  return (
    <section>
      <div className={styles.listContainer}>
        <h2>{isFiltered ? "Filtered" : "Complete"} List of Wainwrights</h2>
        {isFiltered && (
          <div className={styles.listFilters}>
            {filters.region !== 0 && (
              <FilterPill onClick={() => updateFilter("region")}>
                {BookTitles[filters.region].slice(4).toLowerCase()}
              </FilterPill>
            )}
            {filters.height[0] > 290 && (
              <FilterPill
                onClick={() =>
                  updateFilter("height", `290,${filters.height[1]}`)
                }
              >
                {"> " + displayElevation(filters.height[0])}
              </FilterPill>
            )}
            {filters.height[1] < 978 && (
              <FilterPill
                onClick={() =>
                  updateFilter("height", `${filters.height[0]},978`)
                }
              >
                {"< " + displayElevation(filters.height[1])}
              </FilterPill>
            )}
            {filters.withWalk && (
              <FilterPill onClick={() => updateFilter("walk")}>
                has walks
              </FilterPill>
            )}
          </div>
        )}{" "}
        <div className={styles.list}>
          <div className={styles.table}>
            <div className={styles.listHeader}>
              <div className={styles.listRank}>#</div>
              <div className={styles.listName}>Fell</div>
              <div className={styles.listHeight}>Height</div>
              <div className={styles.listRegion}>Region</div>
              <div className={styles.listButtons}>Walks</div>
            </div>
            <ul className={styles.listBody}>
              {simplifiedHills.map((hill, index) => {
                return (
                  <li key={index}>
                    <Link
                      href={`/wainwrights/${hill.slug}`}
                      className={styles.listItem}
                      style={
                        {
                          "--_book-color": `var(--clr-wain-book-${hill.book})`,
                        } as React.CSSProperties
                      }
                    >
                      <div className={styles.listRank}>{hill.rank}</div>
                      <div className={styles.listName}>{hill.name}</div>
                      <div className={styles.listHeight}>
                        {displayElevation(hill.height)}
                      </div>
                      <div className={styles.listRegion}>
                        <span className={styles.listRegionLong}>
                          {BookTitles[hill.book]}
                        </span>
                        <span className={styles.listRegionMed}>
                          {BookTitles[hill.book].slice(4)}
                        </span>
                        <span className={styles.listRegionShort}>
                          {BookTitles[hill.book].slice(4, -6)}
                        </span>
                      </div>
                      <div className={styles.listButtons}>
                        <Link
                          href={`/wainwrights/${hill.slug}`}
                          className={`${buttonStyles.button} ${hill.walks.length > 0 ? buttonStyles.primary : buttonStyles.muted} ${buttonStyles.small}`}
                        >
                          {hill.walks.length > 0 ? (
                            <>View walks ({hill.walks.length})</>
                          ) : (
                            <>More info</>
                          )}
                        </Link>
                      </div>
                      <div className={styles.listArrow}>
                        <RightIcon />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function FilterPill({
  onClick,
  children,
}: {
  onClick: CallableFunction;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.listFilter}>
      {children}
      <button onClick={() => onClick()} title="Remove filter">
        <CloseIconSmall />
      </button>
    </div>
  );
}
