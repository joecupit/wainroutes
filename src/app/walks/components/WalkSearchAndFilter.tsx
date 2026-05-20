import styles from "../Walks.module.css";

import { useState } from "react";
import SelectDropdown from "@/components/SelectDropdown/SelectDropdown";

import {
  CaretDownIcon,
  CaretUpIcon,
  ElevationIcon,
  FilterIcon,
  HikingIcon,
  MapPinIcon,
} from "@/icons/PhosphorIcons";

import { useWalkFilters } from "../contexts/WalkFilterContext";
import WalksSearchBar from "./WalkSearchBar";
import { locations } from "./WalkFilterValues";

export default function WalkSearchAndFilter() {
  const [hideFilters, setHideFilters] = useState(true);
  const { filters, updateFilter, clearFilters, filterOptions, searchTerm } =
    useWalkFilters();

  return (
    <>
      <div className={styles.searchAndFilter}>
        <div className={styles.search}>
          <WalksSearchBar />
          <button
            className={styles.filtersShowHide}
            onClick={() => setHideFilters((prev) => !prev)}
          >
            {hideFilters ? (
              <>
                <FilterIcon />
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
            onChange={(n) => updateFilter("region", n !== "0" ? n : undefined)}
            options={filterOptions.regions}
          />
          <SelectDropdown
            Icon={<HikingIcon />}
            label="Distance"
            value={filters["distance"]}
            onChange={(n) =>
              updateFilter("distance", n !== "any" ? n : undefined)
            }
            options={filterOptions.distances}
          />
          <SelectDropdown
            Icon={<ElevationIcon />}
            label="Elevation"
            value={filters["elevation"]}
            onChange={(n) =>
              updateFilter("elevation", n !== "any" ? n : undefined)
            }
            options={filterOptions.elevations}
          />
          <button
            className={styles.filtersClear}
            onClick={() => clearFilters()}
          >
            Clear filters
          </button>
        </div>
      </div>
      {searchTerm.toLowerCase().replaceAll(" ", "-") in locations && (
        <div className={styles.searchLocationButton}>
          See all&nbsp;
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "instant" });
              updateFilter(
                ["query", "town"],
                ["", searchTerm.toLowerCase().replaceAll(" ", "-")],
              );
            }}
          >
            walks near{" "}
            {locations[searchTerm.toLowerCase().replaceAll(" ", "-")]?.name}
          </button>
        </div>
      )}
    </>
  );
}
