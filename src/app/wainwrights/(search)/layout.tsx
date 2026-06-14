import styles from "./Wainwrights.module.css";

import Hill from "@/types/Hill";

import wainsJson from "@/data/hills.json";
import walksJson from "@/data/walks.json";

import getMapBounds from "@/utils/getMapBounds";
import { displayElevation } from "@/utils/unitConversions";
import { getHillMarkers } from "@/utils/getMapMarkers";

import {
  SimplifiedHill,
  WainwrightsProvider,
} from "./contexts/WainwrightsContext";
import MapSection from "./sections/MapSection";
import ListSection from "./sections/ListSection";
import { Suspense } from "react";

export default async function WainwrightsPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const simplifiedHillData = (wainsJson as Hill[]).map(
    (hill) =>
      ({
        slug: hill.slug,
        name: hill.name,
        secondaryName: hill.secondaryName,
        height: hill.height,
        prominence: hill.prominence,
        book: hill.book,
        rank: hill.rank,
        walks: walksJson
          .filter((walk) => walk.wainwrights?.includes(hill.slug))
          .map((walk) => walk.slug),
      }) as SimplifiedHill,
  );

  const hillMarkers = getHillMarkers();

  const mapBounds = getMapBounds(
    [
      Math.min(...hillMarkers.map((p) => p.coordinates[0])),
      Math.max(...hillMarkers.map((p) => p.coordinates[0])),
    ],
    [
      Math.min(...hillMarkers.map((p) => p.coordinates[1])),
      Math.max(...hillMarkers.map((p) => p.coordinates[1])),
    ],
  );

  return (
    <main className={styles.page}>
      <Suspense fallback={null}>
        <WainwrightsProvider allHills={simplifiedHillData}>
          <div>
            {children}
            <MapSection
              simplifiedHillData={simplifiedHillData}
              hillMarkers={hillMarkers}
              mapBounds={mapBounds}
            />
          </div>

          <ListSection simplifiedHills={simplifiedHillData} />

          <section>
            <h2>Stats and facts</h2>
            <p>Tallest Wainwright: Scafell Pike - {displayElevation(978)}</p>
            <p>Shortest Wainwright: Castle Crag - {displayElevation(270)}</p>
          </section>
        </WainwrightsProvider>
      </Suspense>
    </main>
  );
}
