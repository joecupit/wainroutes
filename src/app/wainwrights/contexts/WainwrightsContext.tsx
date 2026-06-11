"use client";

import { createContext, useContext, useRef, useState } from "react";

type WainwrightsContextValue = {
  activePoint: string | null;
  setActivePoint: (key: string | null) => void;
  mapRef: React.RefObject<HTMLDivElement | null> | null;
};
const initialWalksValue: WainwrightsContextValue = {
  activePoint: null,
  setActivePoint: () => {},
  mapRef: null,
};

const WainwrightsContext =
  createContext<WainwrightsContextValue>(initialWalksValue);

export function useWainwrights() {
  return useContext(WainwrightsContext);
}

export function WainwrightsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activePoint, setActivePoint] = useState<string | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);

  // RETURN VALUES
  const value: WainwrightsContextValue = {
    activePoint: activePoint,
    setActivePoint: setActivePoint,
    mapRef: mapRef,
  };

  return (
    <WainwrightsContext.Provider value={value}>
      {children}
    </WainwrightsContext.Provider>
  );
}
