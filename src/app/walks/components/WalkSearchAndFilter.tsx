import styles from "../Walks.module.css";

import { useMemo, useState } from "react";
import SelectDropdown from "@/components/SelectDropdown/SelectDropdown";

import { CaretDownIcon, CaretUpIcon, FilterIcon } from "@/icons/PhosphorIcons";

import { useWalkFilters } from "../contexts/WalkFilterContext";
import WalksSearchBar from "./WalkSearchBar";

export default function WalkSearchAndFilter() {
  const [hideFilters, setHideFilters] = useState(true);
  const { filters, updateFilter, clearFilters, filterOptions } =
    useWalkFilters();

  const filterCount = useMemo(() => {
    let count = -2;

    for (let filt of Object.keys(filters)) {
      if (filters[filt] !== "any") count += 1;
    }

    return count;
  }, [filters]);

  return (
    <>
      <div className={styles.searchAndFilter}>
        <div className={styles.searchFilterMain}>
          <WalksSearchBar />

          <hr />
          <button
            className={styles.filtersTab}
            onClick={() => setHideFilters((prev) => !prev)}
          >
            <div>
              <FilterIcon /> Filters
            </div>
            <div className={styles.filtersCount} data-active={filterCount > 0}>
              {filterCount > 0 ? filterCount + " active" : "None selected"}{" "}
              {hideFilters ? <CaretDownIcon /> : <CaretUpIcon />}
            </div>
          </button>
        </div>
        <div className={styles.filtersMain} data-hide={hideFilters}>
          <div className={styles.filterFilters}>
            <SelectDropdown
              data-thing={"test"}
              Icon={<div className={styles.filtersLabel}>Near to town</div>}
              label="Town"
              value={filters["town"]}
              onChange={(n) =>
                updateFilter("town", n !== "any" ? n : undefined)
              }
              options={filterOptions.towns}
              triggerClassName={styles.filtersDropdown}
              contentClassName={styles.filtersDropdownContent}
            />
            <SelectDropdown
              Icon={<div className={styles.filtersLabel}>Distance</div>}
              label="Distance"
              value={filters["distance"]}
              onChange={(n) =>
                updateFilter("distance", n !== "any" ? n : undefined)
              }
              options={filterOptions.distances}
              triggerClassName={styles.filtersDropdown}
              contentClassName={styles.filtersDropdownContent}
            />
            <SelectDropdown
              Icon={<div className={styles.filtersLabel}>Elevation</div>}
              label="Elevation"
              value={filters["elevation"]}
              onChange={(n) =>
                updateFilter("elevation", n !== "any" ? n : undefined)
              }
              options={filterOptions.elevations}
              triggerClassName={styles.filtersDropdown}
              contentClassName={styles.filtersDropdownContent}
            />
          </div>
          <button
            className={styles.filtersReset}
            onClick={() => clearFilters()}
          >
            Reset filters
          </button>
        </div>
      </div>
    </>
  );
}
