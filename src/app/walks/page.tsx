import styles from "./Walks.module.css";
import fontStyles from "@/styles/fonts.module.css";

import type Walk from "@/types/Walk";
import { createPageMetadata } from "@/utils/metadata";

import BackToTopButton from "@/components/BackToTopButton/BackToTopButton";
import WalksHero from "./components/WalksHero";
import WalksClient from "./components/WalksClient";
import { locations } from "./components/WalkFilterValues";

import walksJson from "@/data/walks.json";

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
      title: "Lake District Walks",
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
    location: string;
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
          location: walk.startLocation?.location,
          latitude: walk.startLocation?.latitude,
          longitude: walk.startLocation?.longitude,
        },
        intro: walk.intro,
        busConnections: walk.busConnections,
        coverImage: walk.coverImage,
      }) as SimpleWalk,
  );

  return (
    <main className={styles.walks}>
      <BackToTopButton minHeight={600} />

      <WalksHero town={town} />

      <section>
        <div className="flex-column">
          <WalksClient allWalks={simplifiedWalks} />
        </div>
      </section>
    </main>
  );
}
