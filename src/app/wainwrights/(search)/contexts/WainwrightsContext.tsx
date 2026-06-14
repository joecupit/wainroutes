"use client";

import mapStyles from "../sections/MapSection.module.css";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import Hill, { BookTitles } from "@/types/Hill";
import MapMarker from "@/types/MapMarker";

import { getHillMarkers } from "@/utils/getMapMarkers";
import { regionSlugs } from "../constants";

export type SimplifiedHill = {
  slug: Hill["slug"];
  name: Hill["name"];
  secondaryName: Hill["secondaryName"];
  height: Hill["height"];
  prominence: Hill["prominence"];
  book: Hill["book"];
  rank: Hill["rank"];
  walks: string[];
};

type FilterState = {
  searchTerm: string;
  region: number;
  height: number[];
  withWalk: boolean;
};
const initialFilterState: FilterState = {
  searchTerm: "",
  region: 0,
  height: [290, 978],
  withWalk: false,
};

type WainwrightsContextValue = {
  filters: FilterState;
  updateFilter: (key: string | string[], value?: string | string[]) => void;
  resetFilters: () => void;
  isFiltered: boolean;
  filteredHills: SimplifiedHill[];
  filteredHillMarkers: MapMarker[];
  activePoint: string | null;
  setActivePoint: (key: string | null) => void;
  mapRef: React.RefObject<HTMLDivElement | null> | null;
  resetRef: React.RefObject<HTMLButtonElement | null> | null;
};
const initialWalksValue: WainwrightsContextValue = {
  filters: initialFilterState,
  updateFilter: () => {},
  resetFilters: () => {},
  isFiltered: false,
  filteredHills: [],
  filteredHillMarkers: [],
  activePoint: null,
  setActivePoint: () => {},
  mapRef: null,
  resetRef: null,
};

const WainwrightsContext =
  createContext<WainwrightsContextValue>(initialWalksValue);

export function useWainwrights() {
  return useContext(WainwrightsContext);
}

export function WainwrightsProvider({
  allHills,
  children,
}: {
  allHills: SimplifiedHill[];
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const URLParams = useParams();
  const region = String(URLParams.region);

  const [activePoint, setActivePoint] = useState<string | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);

  const hillMarkers = useMemo(() => {
    return getHillMarkers();
  }, []);

  // FILTERS
  const filters: FilterState = useMemo(() => {
    setActivePoint(null);
    const newFilters = { ...initialFilterState } as FilterState;

    if (searchParams.get("query")) {
      newFilters.searchTerm = searchParams.get("query") ?? "";
    } else {
      newFilters.searchTerm = "";
    }
    if (region && region !== "undefined") {
      newFilters.region = regionSlugs[region];
    } else {
      newFilters.region = 0;
    }
    // if (searchParams.get("book")) {
    //   newFilters.region = Number(searchParams.get("book"));
    // } else {
    //   newFilters.region = 0;
    // }
    if (searchParams.get("height")) {
      newFilters.height = searchParams
        .get("height")
        ?.split(",")
        .map(Number) ?? [290, 978];
    } else {
      newFilters.height = [290, 978];
    }

    newFilters.withWalk = searchParams.get("walk") === "yes";

    return newFilters;
  }, [region, searchParamsString]);
  const updateFilter = useCallback(
    (keys: string | string[], values?: string | string[]) => {
      const params = new URLSearchParams(searchParamsString);
      let newRegion = String(region);

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

        if (key == "region") {
          newRegion =
            val && val.length > 0
              ? Object.keys(regionSlugs)[Number(val) - 1]
              : "undefined";
        } else {
          if (val && val.length > 0) params.set(key, val);
          else params.delete(key);
        }
      }

      params.sort();
      if (params.toString().length > 0)
        router.replace(
          `/wainwrights${newRegion !== "undefined" ? `/region/${newRegion}` : ""}?${params.toString()}`,
          { scroll: false },
        );
      else
        router.replace(
          `/wainwrights${newRegion !== "undefined" ? `/region/${newRegion}` : ""}`,
          { scroll: false },
        );
    },
    [region, searchParamsString],
  );
  const resetFilters = useCallback(() => {
    router.replace("/wainwrights", { scroll: false });

    resetRef.current?.classList.add(mapStyles.animate);
    setTimeout(() => {
      resetRef.current?.classList.remove(mapStyles.animate);
    }, 500);
  }, []);
  const [isFiltered, filteredHills, filteredHillMarkers] = useMemo(() => {
    let newHillData = allHills;

    if (filters.searchTerm && filters.searchTerm.length > 0) {
      newHillData = newHillData.filter((hill) =>
        hill.name.toLowerCase().includes(filters.searchTerm.toLowerCase()),
      );
    }
    if (filters.region && BookTitles[filters.region]) {
      newHillData = newHillData.filter((hill) => hill.book === filters.region);
    }
    if (filters.withWalk) {
      newHillData = newHillData.filter((hill) => hill.walks.length > 0);
    }
    newHillData = newHillData.filter(
      (hill) =>
        hill.height >= filters.height[0] && hill.height <= filters.height[1],
    );

    const validSlugs = newHillData.map((hill) => hill.slug);
    return [
      newHillData.length < allHills.length,
      newHillData,
      hillMarkers.filter((marker) =>
        validSlugs.includes(marker.properties.slug),
      ),
    ];
  }, [filters, allHills, hillMarkers]);

  // RETURN VALUES
  const value: WainwrightsContextValue = {
    filters: filters,
    updateFilter: updateFilter,
    resetFilters: resetFilters,
    isFiltered: isFiltered,
    filteredHills: filteredHills,
    filteredHillMarkers: filteredHillMarkers,
    activePoint: activePoint,
    setActivePoint: setActivePoint,
    mapRef: mapRef,
    resetRef: resetRef,
  };

  return (
    <WainwrightsContext.Provider value={value}>
      {children}
    </WainwrightsContext.Provider>
  );
}
