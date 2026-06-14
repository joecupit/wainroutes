import styles from "./HeroSection.module.css";

import { useMemo } from "react";
import { BookTitles } from "@/types/Hill";

export default function WainwrightsHero({ region }: { region?: number }) {
  const bookTitle = useMemo(() => {
    if (region && BookTitles[region]) {
      return BookTitles[region];
    } else {
      return null;
    }
  }, [region]);

  return (
    <section>
      <div className={styles.headerCont}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title} id="wainwrights-title">
              {bookTitle ? (
                <>
                  <span>The 214 Wainwrights:</span> {bookTitle}
                </>
              ) : (
                <>The 214 Wainwrights</>
              )}
            </h1>
            <p className={styles.subtitle}>Interactive Map & Complete List</p>
          </div>
          <p id="wainwrights-desc">
            {bookTitle ? (
              <>
                Explore {bookTitle} on an interactive map of the Lake District
                and discover walking routes for each Wainwright fell.
              </>
            ) : (
              <>
                Explore all 214 Wainwright fells on an interactive map of the
                Lake District. Search by name, filter by region and height, and
                discover walking routes for each fell.
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
