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
import { useSearchParams } from "next/navigation";

import { SimplifiedHill } from "../page";
import { BookTitles } from "@/types/Hill";
import MapMarker from "@/types/MapMarker";

import { getHillMarkers } from "@/utils/getMapMarkers";

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
  const searchParams = useSearchParams();

  const [activePoint, setActivePoint] = useState<string | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);

  const hillMarkers = useMemo(() => {
    return getHillMarkers();
  }, [getHillMarkers]);

  // FILTERS
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  useEffect(() => {
    setActivePoint(null);
    const newFilters = { ...initialFilterState } as FilterState;

    if (searchParams.get("query")) {
      newFilters.searchTerm = searchParams.get("query") ?? "";
    } else {
      newFilters.searchTerm = "";
    }
    if (searchParams.get("book")) {
      newFilters.region = Number(searchParams.get("book"));
    } else {
      newFilters.region = 0;
    }
    if (searchParams.get("height")) {
      newFilters.height = searchParams
        .get("height")
        ?.split(",")
        .map(Number) ?? [290, 978];
    } else {
      newFilters.height = [290, 978];
    }

    newFilters.withWalk = searchParams.get("walk") === "yes";

    setFilters(newFilters);
  }, [searchParams]);
  const updateFilter = useCallback(
    (keys: string | string[], values?: string | string[]) => {
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
      }

      params.sort();
      if (params.toString().length > 0)
        window.history.replaceState(
          {},
          "",
          `/wainwrights?${params.toString()}`,
        );
      else window.history.replaceState({}, "", "/wainwrights");
    },
    [searchParams],
  );
  const resetFilters = useCallback(() => {
    window.history.replaceState({}, "", "/wainwrights");

    resetRef.current?.classList.add(mapStyles.animate);
    setTimeout(() => {
      resetRef.current?.classList.remove(mapStyles.animate);
    }, 500);
  }, []);
  const filteredHillMarkers = useMemo(() => {
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
    return hillMarkers.filter((marker) =>
      validSlugs.includes(marker.properties.slug),
    );
  }, [filters, allHills, hillMarkers]);

  // TITLE
  useEffect(() => {
    const titleElement = document.getElementById("wainwrights-title");
    const descElement = document.getElementById("wainwrights-desc");

    if (filters.region && BookTitles[filters.region]) {
      const bookTitle = BookTitles[filters.region];
      if (titleElement)
        titleElement.innerHTML = `<span>The 214 Wainwrights:</span> ${bookTitle}`;
      if (descElement)
        descElement.innerText = `Explore ${bookTitle} on an interactive map of the Lake District and discover walking routes for each Wainwright fell.`;
      document.title = `${bookTitle} Interactive Wainwright Map | Wainroutes`;
    } else {
      if (titleElement) titleElement.innerHTML = "The 214 Wainwrights";
      if (descElement)
        descElement.innerText =
          "Explore all 214 Wainwright fells on an interactive map of the Lake District. Search by name, filter by region and height, and discover walking routes for each fell.";
      document.title = "The 214 Wainwrights Interactive Map | Wainroutes";
    }
  }, [filters.region]);

  // RETURN VALUES
  const value: WainwrightsContextValue = {
    filters: filters,
    updateFilter: updateFilter,
    resetFilters: resetFilters,
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
