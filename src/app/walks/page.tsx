import styles from "./Walks.module.css";
import fontStyles from "@/styles/fonts.module.css";

import type Walk from "@/types/Walk";
import { createPageMetadata } from "@/utils/metadata";

import BackToTopButton from "@/components/BackToTopButton/BackToTopButton";
import WalksClient from "./components/WalksClient";
import { locations } from "./components/WalkFilterValues";
import LazyImage from "@/components/LazyImage/LazyImage";

import walksJson from "@/data/walks.json";
import wainsJson from "@/data/hills.json";

type MetadataProps = {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
};

export async function generateMetadata({ searchParams }: MetadataProps) {
  const { town } = await searchParams;

  if (town && locations[town]) {
    const location = locations[town];
    return createPageMetadata({
      title: `Lake District Walks near ${location.name}`,
      description: `Find your next Wainwright bagging walk near ${location.name}, filtered by distance, elevation, and public transport access.`,
      path: `/walks?town=${town}`,
    });
  } else {
    return createPageMetadata({
      title: "Walks in the Lake District",
      description:
        "Find your next Wainwright bagging walk in the Lake District, filtered by distance, elevation, and public transport access.",
      path: "/walks",
    });
  }
}

export type SimpleWalk = {
  slug: string;
  title: string;
  recommendedScore?: number;
  wainwrights: string[];
  length: number;
  elevation: number;
  date?: string;
  region: Walk["region"];
  startLocation?: {
    latitude?: number;
    longitude?: number;
  };
  intro?: string;
  busConnections?: Walk["busConnections"];
  coverImage: string;
  distance?: number;
};

export default async function WalksPage({ searchParams }: MetadataProps) {
  const { town } = await searchParams;

  const simplifiedWalks = (walksJson as unknown as Walk[]).map(
    (walk) =>
      ({
        slug: walk.slug,
        title: walk.title,
        recommendedScore: walk.recommendedScore,
        wainwrights: walk.wainwrights,
        length: walk.length,
        elevation: walk.elevation,
        date: walk.date,
        region: walk.region,
        startLocation: {
          latitude: walk.startLocation?.latitude,
          longitude: walk.startLocation?.longitude,
        },
        intro: walk.intro,
        busConnections: walk.busConnections,
        coverImage: walk.coverImage,
      }) as SimpleWalk,
  );

  const wainNames = Object.fromEntries(
    wainsJson.map((hill) => [hill.slug, hill.name]),
  );

  return (
    <main className={styles.walks}>
      <BackToTopButton minHeight={600} />

      <section className={styles.heroSection}>
        <div className={styles.hero}>
          <h1 id="walks-title" className={fontStyles.title}>
            {town && locations[town]
              ? `Walks near ${locations[town].name}`
              : "Walks in the Lake District"}
          </h1>
          <p>
            Browse every walk on Wainroutes. Use the filters to find the perfect
            route for your day in the Lake District.
          </p>
        </div>
        <div>
          <LazyImage
            className={styles.heroImage}
            name={"walks/the-kentmere-horseshoe/13.webp"}
            sizes="100vw"
            alt={""}
          />
        </div>
      </section>

      <section>
        <div className="flex-column">
          <WalksClient allWalks={simplifiedWalks} />
        </div>
      </section>
    </main>
  );
}
