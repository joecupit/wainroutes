import styles from "./MapSection.module.css";

import MapMarker from "@/types/MapMarker";
import { SimplifiedHill } from "../page";

import MapFilters from "../components/MapFilters";
import Map from "../components/Map";

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
  mapBounds,
}: WainwrightsClientProps) {
  return (
    <section>
      <h2 className="visually-hidden">Wainwrights Map</h2>
      <div className={styles.container}>
        <MapFilters />

        <Map simplifiedHillData={simplifiedHillData} mapBounds={mapBounds} />
      </div>
    </section>
  );
}
