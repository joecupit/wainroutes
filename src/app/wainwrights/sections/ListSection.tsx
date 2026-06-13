import styles from "./ListSection.module.css";
import buttonStyles from "@/styles/buttons.module.css";

import Link from "next/link";
import type { SimplifiedHill } from "../page";
import { displayElevation } from "@/utils/unitConversions";
import { BookTitles } from "@/types/Hill";
import { RightIcon } from "@/icons/PhosphorIcons";

export default function ListSection({
  simplifiedHills,
}: {
  simplifiedHills: SimplifiedHill[];
}) {
  simplifiedHills = simplifiedHills.sort((a, b) => b.height - a.height);

  return (
    <section>
      <h2>Complete List of Wainwrights</h2>
      <div className={styles.list}>
        <div className={styles.table}>
          <div className={styles.listHeader}>
            <div className={styles.listRank}>#</div>
            <div className={styles.listName}>Fell</div>
            <div className={styles.listHeight}>Height</div>
            <div className={styles.listRegion}>Region</div>
            <div className={styles.listButtons}>Walks</div>
          </div>
          <ul className={styles.listBody}>
            {simplifiedHills.map((hill, index) => {
              return (
                <li key={index}>
                  <Link
                    href={`/wainwrights/${hill.slug}`}
                    className={styles.listItem}
                    style={
                      {
                        "--_book-color": `var(--clr-wain-book-${hill.book})`,
                      } as React.CSSProperties
                    }
                  >
                    <div className={styles.listRank}>{index + 1}</div>
                    <div className={styles.listName}>{hill.name}</div>
                    <div className={styles.listHeight}>
                      {displayElevation(hill.height)}
                    </div>
                    <div className={styles.listRegion}>
                      <span className={styles.listRegionLong}>
                        {BookTitles[hill.book]}
                      </span>
                      <span className={styles.listRegionMed}>
                        {BookTitles[hill.book].slice(4)}
                      </span>
                      <span className={styles.listRegionShort}>
                        {BookTitles[hill.book].slice(4, -6)}
                      </span>
                    </div>
                    <div className={styles.listButtons}>
                      <Link
                        href={`/wainwrights/${hill.slug}`}
                        className={`${buttonStyles.button} ${hill.walks.length > 0 ? buttonStyles.primary : buttonStyles.muted} ${buttonStyles.small}`}
                      >
                        {hill.walks.length > 0 ? (
                          <>View walks ({hill.walks.length})</>
                        ) : (
                          <>More info</>
                        )}
                      </Link>
                    </div>
                    <div className={styles.listArrow}>
                      <RightIcon />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
