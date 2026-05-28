import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import Fuse from "fuse.js";

import haversineDistance from "@/utils/haversineDistance";
import { BookTitles } from "@/types/Hill";
import { SimpleWalk } from "../page";

import {
  distanceOptions,
  distanceValues,
  elevationOptions,
  elevationValues,
  Locations,
  locations,
  regionOptions,
} from "../components/WalkFilterValues";
import { displayDistance } from "@/utils/unitConversions";

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

type WalksContextValue = {
  walks: SimpleWalk[];
  filters: FilterState;
  sortValue: string;
  setSortValue: (value: string) => void;
  updateFilter: (key: string | string[], value?: string | string[]) => void;
  clearFilters: () => void;
  searchRef: React.RefObject<HTMLInputElement | null> | null;
  isFiltered: boolean;
  totalWalks: number;
  showDistances: boolean;
  locations: Locations;
  filterOptions: {
    sort: { [key: string]: string };
    towns: { [key: string]: string };
    regions: { [key: string]: string };
    distances: { [key: string]: string };
    elevations: { [key: string]: string };
  };
  searchTerm: string;
};
const initialWalksValue: WalksContextValue = {
  walks: [],
  filters: initialFilterState,
  sortValue: "recommended",
  setSortValue: () => {},
  updateFilter: () => {},
  clearFilters: () => {},
  searchRef: null,
  isFiltered: false,
  totalWalks: 0,
  showDistances: false,
  locations: {},
  filterOptions: {
    sort: {},
    towns: {},
    regions: {},
    distances: {},
    elevations: {},
  },
  searchTerm: "",
};

const WalkFiltersContext = createContext<WalksContextValue>(initialWalksValue);

export function useWalkFilters() {
  return useContext(WalkFiltersContext);
}

export function WalkFiltersProvider({
  allWalks,
  children,
}: {
  allWalks: SimpleWalk[];
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();

  // FILTERS
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    const newFilters = { ...initialFilterState } as FilterState;

    if (params.town && params.town in locations) {
      if (!locationSelectEntries.includes(params.town)) {
        setLocationSelectEntries((prev) => [...prev, params.town]);
      }
      newFilters.town = params.town;
    }
    if (params.region && params.region in BookTitles) {
      newFilters.region = params.region;
    }
    if (params.distance && params.distance in distanceOptions) {
      newFilters.distance = params.distance;
    }
    if (params.elevation && params.elevation in elevationOptions) {
      newFilters.elevation = params.elevation;
    }
    newFilters.byBus = params.byBus === "yes";

    setFilters(newFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);
  const updateFilter = (
    keys: string | string[],
    values?: string | string[],
  ) => {
    const params = new URLSearchParams(searchParams);

    if (
      typeof keys === "string" &&
      (typeof values === "string" || typeof values === "undefined")
    ) {
      keys = [keys];
      values = values ? [values] : undefined;
    }

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const val = values ? values[i] : undefined;

      if (val && val.length > 0) params.set(key, val);
      else params.delete(key);

      if (["town", "region", "distance", "elevation", "byBus"].includes(key)) {
        searchRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }

    params.sort();
    window.history.replaceState({}, "", `/walks?${params.toString()}`);
  };
  const clearFilters = () => {
    const params = new URLSearchParams();
    if (searchParams.get("sort") !== null) {
      params.set("sort", searchParams.get("sort") ?? "recommended");
    }

    window.history.replaceState({}, "", `/walks?${params.toString()}`);
  };

  // LOCATION FILTERING
  const [locationSelectEntries, setLocationSelectEntries] = useState<string[]>([
    "keswick",
    "ambleside",
    "grasmere",
    "buttermere",
    "borrowdale",
    "coniston",
    "glenridding",
    "windermere",
    "penrith",
  ]);
  const townOptions = useMemo(() => {
    return Object.fromEntries([
      ["any", "Any town"],
      ...locationSelectEntries.map((loc) => [loc, locations[loc]?.name ?? loc]),
    ]);
  }, [locationSelectEntries]);

  const townParam = useMemo(() => {
    return searchParams.get("town");
  }, [searchParams]);
  useEffect(() => {
    const titleElement = document.getElementById("walks-title");
    const descElement = document.getElementById("walks-desc");

    if (townParam && locations[townParam]) {
      const location = locations[townParam];
      if (titleElement) titleElement.innerText = `Walks near ${location.name}`;
      if (descElement)
        descElement.innerText = `Browse all walks within ${displayDistance((locations[townParam].distScale ?? 1) * 10, 0)} of ${locations[townParam].name}. Filter routes by town, distance, and elevation to find the perfect route for you.`;
      document.title = `Lake District Walks near ${location.name} | Wainroutes`;
    } else {
      if (titleElement) titleElement.innerText = "Lake District Walks";
      if (descElement)
        descElement.innerText =
          "Browse every walk on the site. Filter routes by town, distance, and elevation to find the perfect route for you.";
      document.title = "Lake District Walks | Wainroutes";
    }
  }, [townParam]);
  const showDistances = useMemo(() => {
    return Boolean(townParam && locations[townParam]);
  }, [townParam]);
  useEffect(() => {
    if (showDistances) {
      setSortValue("closest");
    } else if (!showDistances && sortValue === "closest") {
      setSortValue("recommended");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDistances]);

  // SORTING
  const sortOptions = {
    "recommended": "Recommended",
    "recent": "Recently Added",
    "hills-dsc": "Most Wainwrights",
    "hills-asc": "Least Wainwrights",
    "dist-dsc": "Longest",
    "dist-asc": "Shortest",
    "ele-dsc": "Most Elevation",
    "ele-asc": "Least Elevation",
  };
  const [sortValue, setSortValue] = useState(
    searchParams.get("sort") ?? "recommended",
  );
  useEffect(() => {
    if (sortValue !== "recommended") {
      updateFilter("sort", sortValue);
    } else {
      updateFilter("sort");
    }
  }, [sortValue]);

  // SEARCHING
  const searchRef = useRef<HTMLInputElement>(null);
  const searchTerm = useMemo(() => {
    const params = Object.fromEntries(searchParams.entries());
    return params.query ?? "";
  }, [searchParams]);

  // WALK LISTS
  const searchableWalks = useMemo(() => {
    return new Fuse(allWalks, {
      keys: ["title", "wainwrights", "startLocation.location", "tags"],
      threshold: 0.25,
      includeScore: true,
    });
  }, [allWalks]);
  const filteredWalks = useMemo(() => {
    let newWalks = [...allWalks];

    const query = searchParams.get("query") ?? "";
    if (query.length > 0) {
      newWalks = searchableWalks
        .search(query)
        .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
        .map((res) => res.item);
    }

    const town = searchParams.get("town");
    if (town && locations[town]) {
      const townCoords = locations[town].coords;
      for (const walk of newWalks) {
        walk.distance =
          haversineDistance(townCoords, [
            walk.startLocation?.longitude ?? 0,
            walk.startLocation?.latitude ?? 0,
          ]) / 1000;
      }
      newWalks = newWalks.filter(
        (walk) => walk.distance! < (locations[town]?.distScale ?? 1) * 10,
      );
    }

    const region = searchParams.get("region");
    if (region && region in BookTitles) {
      newWalks = newWalks.filter((w) => String(w.region) === region);
    }

    const distance = searchParams.get("distance");
    if (distance) {
      const distBoundaries = distanceValues[distance];
      if (distBoundaries?.[0])
        newWalks = newWalks.filter((w) => w.length >= distBoundaries[0]);
      if (distBoundaries?.[1])
        newWalks = newWalks.filter((w) => w.length <= distBoundaries[1]);
    }

    const elevation = searchParams.get("elevation");
    if (elevation) {
      const eleBoundaries = elevationValues[elevation];
      if (eleBoundaries?.[0])
        newWalks = newWalks.filter((w) => w.elevation >= eleBoundaries[0]);
      if (eleBoundaries?.[1])
        newWalks = newWalks.filter((w) => w.elevation <= eleBoundaries[1]);
    }

    const wainwrights = searchParams.get("wainwrights");
    if (wainwrights) {
      const validSlugs = wainwrights.split(" ");
      console.log(wainwrights, validSlugs);
      if (validSlugs.length > 0)
        newWalks = newWalks.filter((w) =>
          w.wainwrights.some((s) => validSlugs.includes(s)),
        );
    }

    const byBus = searchParams.get("byBus");
    if (byBus === "yes") {
      newWalks = newWalks.filter(
        (w) => Object.keys(w.busConnections ?? {}).length > 0,
      );
    }

    return newWalks;
  }, [allWalks, searchableWalks, searchParams]);
  const sortedWalks = useMemo(() => {
    const newWalkData = [...filteredWalks];

    const [type, dir] = sortValue.split("-");
    switch (type) {
      case "closest":
        newWalkData.sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));
        break;
      case "recent":
        newWalkData.sort(
          (a, b) =>
            new Date(b.date ?? "").getTime() - new Date(a.date ?? "").getTime(),
        );
        break;
      case "hills":
        newWalkData.sort(
          (a, b) => (a.wainwrights?.length ?? 0) - (b.wainwrights?.length ?? 0),
        );
        break;
      case "ele":
        newWalkData.sort((a, b) => (a.elevation ?? 0) - (b.elevation ?? 0));
        break;
      case "dist":
        newWalkData.sort((a, b) => (a.length ?? 0) - (b.length ?? 0));
        break;
      default:
        newWalkData
          .sort((a, b) => a.title.localeCompare(b.title))
          .sort(
            (a, b) => (b.recommendedScore ?? 0) - (a.recommendedScore ?? 0),
          );
        break;
    }

    if (dir === "dsc") newWalkData.reverse();

    return newWalkData;
  }, [filteredWalks, sortValue]);

  // RETURN VALUES
  const value: WalksContextValue = {
    walks: sortedWalks,
    filters: filters,
    sortValue: sortValue,
    setSortValue: setSortValue,
    updateFilter: updateFilter,
    clearFilters: clearFilters,
    searchRef: searchRef,
    isFiltered: filteredWalks.length < allWalks.length,
    totalWalks: allWalks.length,
    showDistances: showDistances,
    locations: locations,
    filterOptions: {
      sort: sortOptions,
      towns: townOptions,
      regions: regionOptions,
      distances: distanceOptions,
      elevations: elevationOptions,
    },
    searchTerm: searchTerm,
  };

  return (
    <WalkFiltersContext.Provider value={value}>
      {children}
    </WalkFiltersContext.Provider>
  );
}
