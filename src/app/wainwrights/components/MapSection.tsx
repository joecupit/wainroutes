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

  const resetFilters = useCallback(() => {
    window.history.replaceState({}, "", "/wainwrights");
  }, []);

  return (
    <section>
      <h2 className="visually-hidden">Wainwrights Map</h2>
      <div className={styles.mapContainer}>
        <div className={styles.mapFilters}>
          <h3>Filter & search</h3>
          <input
            type="search"
            placeholder="Search by fell name..."
            value={searchTermBuffer}
            onChange={(e) => setSearchTermBuffer(e.target.value)}
          />
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
              <input
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
              />
            </div>
            <button
              onClick={() => {
                setHeightBuffer([290, 978]);
                setHeight([290, 978]);
              }}
            >
              reset
            </button>
          </div>

          <div>
            <label>
              <input
                type="checkbox"
                checked={withWalk}
                onChange={(e) => updateWithWalks(e.target.checked)}
              />{" "}
              Show only with walks
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
