import styles from "../Walks.module.css";
import fontStyles from "@/styles/fonts.module.css";

import LazyImage from "@/components/LazyImage/LazyImage";
import { displayDistance } from "@/utils/unitConversions";
import { locations } from "./WalkFilterValues";
import { useMemo } from "react";

export default function WalksHero({ town }: { town?: string }) {
  const townFiltered = useMemo(() => {
    if (town && locations[town]) {
      return locations[town];
    } else {
      return null;
    }
  }, [town]);

  return (
    <section className={styles.heroSection}>
      <div className={styles.hero}>
        <div>
          <h1 className={fontStyles.title} id="walks-title">
            {townFiltered
              ? `Walks near ${townFiltered.name}`
              : "Lake District Walks"}
          </h1>
        </div>
        <p id="walks-desc">
          {townFiltered
            ? `Browse all walks within ${displayDistance((townFiltered.distScale ?? 1) * 10, 0)} of ${townFiltered.name}.`
            : "Browse every walk on the site."}{" "}
          Filter routes by town, distance, and elevation to find the perfect
          route for you.
        </p>
      </div>
      <div>
        <LazyImage
          className={styles.heroImage}
          name={"walks/the-fells-south-of-buttermere/03.webp"}
          sizes="100vw"
          alt={""}
        />
      </div>
    </section>
  );
}
