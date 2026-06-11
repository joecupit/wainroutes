import styles from "../Wainwrights.module.css";
import buttonStyles from "@/styles/buttons.module.css";

import Link from "next/link";
import type { SimplifiedHill } from "../page";
import { BookTitles } from "@/types/Hill";
import { displayElevation } from "@/utils/unitConversions";
import { MapIcon } from "@/icons/PhosphorIcons";
import MapViewButton from "./MapViewButton";

type WainwrightListProps = {
  simplifiedHills: SimplifiedHill[];
  book: number;
};

export default function WainwrightList({
  simplifiedHills,
}: WainwrightListProps) {
  simplifiedHills = simplifiedHills.sort((a, b) => b.height - a.height);

  return (
    <div className={styles.list}>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableRank}>#</th>
              <th className={styles.tableName}>Fell</th>
              <th className={styles.tableHeight}>Height</th>
              <th className={styles.tableBook}>Region</th>
              <th className={styles.tableWalks}>Walks</th>
            </tr>
          </thead>
          <tbody>
            {simplifiedHills.map((hill, index) => {
              return (
                <tr key={index}>
                  <td className={styles.tableRank}>{index + 1}</td>
                  <td className={styles.tableName}>
                    <Link href={`/wainwrights/${hill.slug}`}>{hill.name}</Link>
                  </td>
                  <td className={styles.tableHeight}>
                    {displayElevation(hill.height)}
                  </td>
                  <td
                    className={styles.tableBook}
                    style={
                      {
                        "--_book-color": `var(--clr-wain-book-${hill.book})`,
                      } as React.CSSProperties
                    }
                  >
                    <div className={styles.tableFlex}>
                      <Link href={`/wainwrights?book=${hill.book}`}>
                        {BookTitles[hill.book].slice(4)}
                      </Link>
                    </div>
                  </td>
                  <td className={styles.tableWalks}>
                    <div className={styles.tableFlex}>
                      {/* {hill.walks.length} */}
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
                      <MapViewButton slug={hill.slug} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
