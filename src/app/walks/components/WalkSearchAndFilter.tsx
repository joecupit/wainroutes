import styles from "../Walks.module.css";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { BookTitles } from "@/types/Hill";
import {
  CaretDownIcon,
  CaretUpIcon,
  ElevationIcon,
  HikingIcon,
  MapPinIcon,
} from "@/icons/PhosphorIcons";

import WalksSearchBar from "./WalkSearchBar";
import SelectDropdown from "./SelectDropdown";

import {
  distanceOptions,
  elevationOptions,
  locations,
} from "./WalkFilterValues";

type FilterState = {
  town: string;
  region: string;
  distance: string;
  elevation: string;
  byBus: boolean;
};

const initialFilterState: FilterState = {
  town: "any",
  region: "0",
  distance: "any",
  elevation: "any",
  byBus: false,
};

export default function WalkSearchAndFilter({
  clearFilters,
}: {
  clearFilters: CallableFunction;
}) {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const updateParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value.length > 0) params.set(key, value);
    else params.delete(key);

    window.history.replaceState({}, "", `/walks?${params.toString()}`);
  };

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const newFilters = { ...initialFilterState } as FilterState;

    // update town
    if (params.town && params.town in locations) {
      if (!locationSelectEntries.includes(params.town)) {
        setLocationSelectEntries((prev) => [...prev, params.town]);
      }
      newFilters.town = params.town;
    }

    // update distance
    if (params.region && params.region in BookTitles) {
      newFilters.region = params.region;
    }

    // update distance
    if (params.distance && params.distance in distanceOptions) {
      newFilters.distance = params.distance;
    }

    // update elevation
    if (params.elevation && params.elevation in elevationOptions) {
      newFilters.elevation = params.elevation;
    }

    // update accessible by bus
    newFilters.byBus = params.byBus === "yes";

    setFilters(newFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const [locationSelectEntries, setLocationSelectEntries] = useState<string[]>([
    "keswick",
    "ambleside",
    "grasmere",
    "buttermere",
    "borrowdale",
    "coniston",
    "glenridding",
    "windermere",
  ]);

  const cleanedBookTitles = {
    "0": "All regions",
    ...Object.fromEntries(
      Object.entries(BookTitles).map(([key, title]) => [
        String(key),
        title.replace(/^The\s+/i, ""),
      ]),
    ),
  };

  const [hideFilters, setHideFilters] = useState(true);

  return (
    <div className={styles.searchAndFilter}>
      <div className={styles.search}>
        <WalksSearchBar />

        <button
          className={styles.filtersShowHide}
          onClick={() => setHideFilters((prev) => !prev)}
        >
          {hideFilters ? (
            <>
              <CaretDownIcon />
            </>
          ) : (
            <>
              <CaretUpIcon />
            </>
          )}
        </button>
      </div>
      <hr />
      <div className={styles.filters} data-hide={hideFilters}>
        <SelectDropdown
          Icon={<MapPinIcon />}
          label="Region"
          value={filters["region"]}
          onChange={(n) => updateParam("region", n !== "0" ? n : undefined)}
          options={cleanedBookTitles}
        />
        <SelectDropdown
          Icon={<HikingIcon />}
          label="Distance"
          value={filters["distance"]}
          onChange={(n) => updateParam("distance", n !== "any" ? n : undefined)}
          options={{
            "any": "Any distance",
            "0-6": "Under 6km",
            "6-12": "6km - 12km",
            "12-18": "12km - 18km",
            "18+": "18km+",
          }}
        />
        <SelectDropdown
          Icon={<ElevationIcon />}
          label="Elevation"
          value={filters["elevation"]}
          onChange={(n) =>
            updateParam("elevation", n !== "any" ? n : undefined)
          }
          options={{
            "any": "Any ascent",
            "0-300": "Under 300m",
            "300-600": "300m - 600m",
            "600-900": "600m - 900m",
            "900+": "900m+",
          }}
        />

        <button className={styles.filtersClear} onClick={() => clearFilters()}>
          Clear filters
        </button>
      </div>
    </div>
  );
}
