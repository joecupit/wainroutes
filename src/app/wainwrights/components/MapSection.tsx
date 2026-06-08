"use client";

import styles from "../Wainwrights.module.css";
import buttonStyles from "@/styles/buttons.module.css";

import MapMarker from "@/types/MapMarker";
import LakeMap from "@/components/Map/Map";
import { SimplifiedHill } from "../page";
import { useSearchParams } from "next/navigation";
import { BookTitles, BookTotals } from "@/types/Hill";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { displayElevation } from "@/utils/unitConversions";
import {
  ArrowRightIcon,
  CloseIcon,
  CloseIconSmall,
  ResetIcon,
  SearchIcon,
} from "@/icons/PhosphorIcons";

import { Slider, SliderSingleProps } from "antd";

type WainwrightsClientProps = {
  simplifiedHillData: SimplifiedHill[];
  hillMarkers: MapMarker[];
  mapBounds: {
    center: [number, number];
    zoom: number;
  };
};

const formatter: NonNullable<SliderSingleProps["tooltip"]>["formatter"] = (
  value,
) => `${value}m`;

export default function MapSection({
  simplifiedHillData,
  hillMarkers,
  mapBounds,
}: WainwrightsClientProps) {
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("query") ?? "");
  const [searchTermBuffer, setSearchTermBuffer] = useState(searchTerm);
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(searchTermBuffer);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTermBuffer]);
  const [book, setBook] = useState(searchParams.get("book") ?? 0);
  const [withWalk, setWithWalk] = useState(searchParams.get("walk") === "yes");
  const [height, setHeight] = useState(
    searchParams.get("height")?.split(",").map(Number) ?? [290, 978],
  );
  const [heightBuffer, setHeightBuffer] = useState(height);
  useEffect(() => {
    const handler = setTimeout(() => {
      setHeight(heightBuffer);
    }, 200);
    return () => clearTimeout(handler);
  }, [heightBuffer]);

  useEffect(() => {
    setActivePoint(null);

    if (searchParams.get("query")) {
      setSearchTerm(searchParams.get("query") ?? "");
      setSearchTermBuffer(searchParams.get("query") ?? "");
    } else {
      setSearchTerm("");
      setSearchTermBuffer("");
    }
    if (searchParams.get("book")) {
      setBook(Number(searchParams.get("book")));
    } else {
      setBook(0);
    }
    if (searchParams.get("height")) {
      setHeightBuffer(
        searchParams.get("height")?.split(",").map(Number) ?? [290, 978],
      );
      setHeight(
        searchParams.get("height")?.split(",").map(Number) ?? [290, 978],
      );
    } else {
      setHeightBuffer([290, 978]);
      setHeight([290, 978]);
    }

    setWithWalk(searchParams.get("walk") === "yes");
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (searchTerm.length > 0) {
      params.set("query", searchTerm);
    } else {
      params.delete("query");
    }

    params.sort();
    window.history.replaceState({}, "", `/wainwrights?${params.toString()}`);
  }, [searchTerm]);
  const updateBook = useCallback(
    (bookId: number) => {
      const params = new URLSearchParams(searchParams);

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
  const updateWithWalks = useCallback(
    (withWalks: boolean) => {
      const params = new URLSearchParams(searchParams);

      if (withWalks) {
        params.set("walk", "yes");
      } else {
        params.delete("walk");
      }

      params.sort();
      window.history.replaceState({}, "", `/wainwrights?${params.toString()}`);
    },
    [searchParams],
  );
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (height[0] !== 290 || height[1] !== 978) {
      params.set("height", height.join(","));
    } else {
      params.delete("height");
    }

    params.sort();
    window.history.replaceState({}, "", `/wainwrights?${params.toString()}`);
  }, [height]);

  const filteredHillMarkers = useMemo(() => {
    let newHillData = simplifiedHillData;

    console.log(searchTerm);
    if (searchTerm && searchTerm.length > 0) {
      newHillData = newHillData.filter((hill) =>
        hill.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    if (book && BookTitles[Number(book)]) {
      newHillData = newHillData.filter((hill) => hill.book === book);
    }
    if (withWalk) {
      newHillData = newHillData.filter((hill) => hill.walks.length > 0);
    }
    newHillData = newHillData.filter(
      (hill) => hill.height >= height[0] && hill.height <= height[1],
    );

    const validSlugs = newHillData.map((hill) => hill.slug);
    return hillMarkers.filter((marker) =>
      validSlugs.includes(marker.properties.slug),
    );
  }, [searchTerm, book, withWalk, height, simplifiedHillData, hillMarkers]);

  const [activePoint, setActivePoint] = useState<string | null>(null);

  const activeHill = useMemo(() => {
    if (!activePoint) return undefined;

    return simplifiedHillData.find((h) => h.slug === activePoint);
  }, [activePoint]);

  const mapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!activePoint || !mapRef.current) return;

    if (window.scrollY < mapRef.current.getBoundingClientRect().top) {
      mapRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activePoint]);

  const resetRef = useRef<HTMLButtonElement>(null);
  const resetFilters = useCallback(() => {
    window.history.replaceState({}, "", "/wainwrights");

    resetRef.current?.classList.add(styles.animate);
    setTimeout(() => {
      resetRef.current?.classList.remove(styles.animate);
    }, 500);
  }, []);

  useEffect(() => {
    const titleElement = document.getElementById("wainwrights-title");

    if (book && BookTitles[Number(book)]) {
      const bookTitle = BookTitles[Number(book)];
      if (titleElement)
        titleElement.innerHTML = `<span>The 214 Wainwrights:</span> ${bookTitle}`;
      document.title = `${bookTitle} Interactive Wainwright Map | Wainroutes`;
    } else {
      if (titleElement) titleElement.innerHTML = "The 214 Wainwrights";
      document.title = "The 214 Wainwrights Interactive Map | Wainroutes";
    }
  }, [book]);

  return (
    <section>
      <h2 className="visually-hidden">Wainwrights Map</h2>
      <div className={styles.mapContainer}>
        <div className={styles.mapFiltersContainer}>
          <div className={styles.mapFiltersHeader}>
            <h3>Filter & Search</h3>
            <button onClick={resetFilters}>Clear all</button>
          </div>
          <div className={styles.mapFilters}>
            <div className={styles.searchFilter}>
              <SearchIcon />
              <input
                type="search"
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
                  active={book === 0}
                  onChange={updateBook}
                >
                  All Regions<span>214</span>
                </RadioButton>
                {[1, 2, 3, 4, 5, 6, 7].map((bookId) => (
                  <RadioButton
                    name="book"
                    value={bookId}
                    key={bookId}
                    active={book === bookId}
                    onChange={updateBook}
                    bookId={bookId}
                  >
                    {BookTitles[bookId].slice(4)}
                    <span>{BookTotals[bookId]}</span>
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
                    setHeight([290, 978]);
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
                <span>{displayElevation(height[0])}</span>
                <span>{displayElevation(height[1])}</span>
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
                  checked={withWalk}
                  onChange={(e) => updateWithWalks(e.target.checked)}
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
        <div className={styles.map} ref={mapRef}>
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
                    <Link href={`/wainwrights/${activeHill.slug}`}>
                      {activeHill.name}
                    </Link>

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
                {/* <p className={styles.hillBook}>{`Book ${activeHill.book}`}</p> */}
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
                  href={`/wainwrights/${activeHill.slug}`}
                  className={`${buttonStyles.button} ${buttonStyles.small} ${activeHill.walks.length > 0 ? buttonStyles.primary : buttonStyles.muted}`}
                >
                  See walks ({activeHill.walks.length})
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
        onChange={() => onChange(value)}
      />
      {children}
    </label>
  );
}
