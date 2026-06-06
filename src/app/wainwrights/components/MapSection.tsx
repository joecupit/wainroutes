"use client";

import styles from "../Wainwrights.module.css";
import buttonStyles from "@/styles/buttons.module.css";

import MapMarker from "@/types/MapMarker";
import LakeMap from "@/components/Map/Map";
import { SimplifiedHill } from "../page";
import { useSearchParams } from "next/navigation";
import { BookTitles } from "@/types/Hill";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { displayElevation } from "@/utils/unitConversions";
import {
  ArrowRightIcon,
  CloseIcon,
  CloseIconSmall,
} from "@/icons/PhosphorIcons";

type WainwrightsClientProps = {
  simplifiedHillData: SimplifiedHill[];
  hillMarkers: MapMarker[];
  mapBounds: {
    center: [number, number];
    zoom: number;
  };
};

export default function MapSection({
  simplifiedHillData,
  hillMarkers,
  mapBounds,
}: WainwrightsClientProps) {
  const searchParams = useSearchParams();

  const [book, setBook] = useState(0);
  useEffect(() => {
    if (searchParams.get("book")) {
      setBook(Number(searchParams.get("book")));
    } else {
      setBook(0);
    }
  }, [searchParams]);

  const updateBook = useCallback(
    (bookId: number) => {
      const params = new URLSearchParams(searchParams);
      console.log(bookId, bookId in BookTitles);

      if (bookId in BookTitles) {
        params.set("book", String(bookId));
      } else {
        params.delete("book");
      }

      params.sort();
      window.history.replaceState({}, "", `/wainwrights?${params.toString()}`);
    },
    [searchParams],
  );

  const [filteredHillData, filteredHillMarkers] = useMemo(() => {
    if (book && BookTitles[Number(book)]) {
      return [
        simplifiedHillData.filter((hill) => hill.book === book),
        hillMarkers.filter((marker) => marker.properties.book === book),
      ];
    } else return [simplifiedHillData, hillMarkers];
  }, [book, simplifiedHillData, hillMarkers]);

  const [activePoint, setActivePoint] = useState<string | null>(null);

  const activeHill = useMemo(() => {
    if (!activePoint) return undefined;

    return simplifiedHillData.find((h) => h.slug === activePoint);
  }, [activePoint]);

  const resetFilters = useCallback(() => {
    window.history.replaceState({}, "", "/wainwrights");
  }, []);

  return (
    <section>
      <h2 className="visually-hidden">Wainwrights Map</h2>
      <div className={styles.mapContainer}>
        <div className={styles.mapFilters}>
          <h3>Filter & search</h3>
          <input type="search" />
          <div>
            <h4>Region</h4>
            <div className={styles.byRegion}>
              <RadioButton
                name="book"
                value={0}
                active={book === 0}
                onChange={updateBook}
              >
                All regions
              </RadioButton>
              {[1, 2, 3, 4, 5, 6, 7].map((bookId) => (
                <RadioButton
                  name="book"
                  value={bookId}
                  key={bookId}
                  active={book === bookId}
                  onChange={updateBook}
                >
                  {BookTitles[bookId].slice(4)}
                </RadioButton>
              ))}
            </div>
          </div>

          <div>
            <h4>Height</h4>
            <input type="range" />
          </div>

          <div>
            <label>
              <input type="checkbox" /> Show only with walks
            </label>
          </div>

          <button onClick={resetFilters}>Reset filters</button>
        </div>
        <div className={styles.map}>
          <LakeMap
            primaryMarkers={filteredHillMarkers}
            defaultCenter={mapBounds.center}
            defaultZoom={mapBounds.zoom}
            activePoint={activePoint}
            setActivePoint={setActivePoint}
          />
          {activeHill && (
            <div className={styles.wainwrightOverlay}>
              {/* <div className={styles.hillPhoto}>No photo</div> */}
              <div>
                <div className={styles.hillName}>
                  <h4>
                    {activeHill.name}
                    {/* {activeHill.secondaryName
                      ? ` (${activeHill.secondaryName})`
                      : ""} */}
                  </h4>
                  <button
                    onClick={() => setActivePoint(null)}
                    className={styles.hillClose}
                    title="Close"
                  >
                    <CloseIconSmall />
                  </button>
                </div>
                <p className={styles.hillBook}>{BookTitles[activeHill.book]}</p>
              </div>
              <div>
                <p>Height: {displayElevation(activeHill.height)}</p>
                {/* <p>Prominence: {displayElevation(activeHill.prominence)}</p> */}
              </div>
              <div>
                {/* <Link
                  href={`/wainwrights/${activeHill.slug}`}
                  className={`${buttonStyles.button} ${buttonStyles.small}`}
                >
                  More details <ArrowRightIcon />
                </Link> */}
                <Link
                  href={`/wainwrights/${activeHill.slug}#walks`}
                  className={`${buttonStyles.button} ${buttonStyles.small} ${buttonStyles.primary}`}
                >
                  See walks (1)
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function RadioButton({
  name,
  value,
  children,
  active,
  onChange,
}: {
  name: string;
  value: string | number | undefined;
  children: React.ReactNode;
  active: boolean;
  onChange: CallableFunction;
}) {
  return (
    <label className={styles.filterRadio}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={active}
        onChange={() => onChange(value)}
      />
      {children}
    </label>
  );
}
