"use client";

import styles from "../sections/MapSection.module.css";
import buttonStyles from "@/styles/buttons.module.css";

import { BookTitles } from "@/types/Hill";
import { displayElevation } from "@/utils/unitConversions";
import { CloseIconSmall } from "@/icons/PhosphorIcons";

import { useEffect, useMemo } from "react";
import LakeMap from "@/components/Map/Map";
import Link from "next/link";
import { SimplifiedHill, useWainwrights } from "../contexts/WainwrightsContext";

export default function Map({
  simplifiedHillData,
  mapBounds,
}: {
  simplifiedHillData: SimplifiedHill[];
  mapBounds: {
    center: [number, number];
    zoom: number;
  };
}) {
  const { filteredHillMarkers, activePoint, setActivePoint, mapRef } =
    useWainwrights();

  const activeHill = useMemo(() => {
    if (!activePoint) return undefined;

    return simplifiedHillData.find((h) => h.slug === activePoint);
  }, [activePoint]);

  useEffect(() => {
    if (!activePoint || !mapRef?.current) return;

    if (window.scrollY < mapRef.current.getBoundingClientRect().top) {
      mapRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activePoint]);

  return (
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
  );
}
