"use client";

import buttonStyles from "@/styles/buttons.module.css";

import { MapIcon } from "@/icons/PhosphorIcons";
import { useCallback } from "react";
import { useWainwrights } from "../contexts/WainwrightsContext";

export default function MapViewButton({ slug }: { slug: string }) {
  const { setActivePoint, mapRef } = useWainwrights();

  const showOnMap = useCallback(() => {
    mapRef?.current?.scrollIntoView({ behavior: "smooth" });
    setActivePoint(slug);
  }, [slug]);

  return (
    <button
      className={`${buttonStyles.button} ${buttonStyles.muted} ${buttonStyles.small}`}
      onClick={showOnMap}
      title="View on map"
    >
      <MapIcon />
    </button>
  );
}
