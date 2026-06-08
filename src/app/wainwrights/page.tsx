import styles from "./Wainwrights.module.css";
import fontStyles from "@/styles/fonts.module.css";

import { createPageMetadata } from "@/utils/metadata";

import Hill, { BookTitles } from "@/types/Hill";
import { getHillMarkers } from "@/utils/getMapMarkers";

import wainsJson from "@/data/hills.json";
import walksJson from "@/data/walks.json";
import getMapBounds from "@/utils/getMapBounds";
import MapSection from "./components/MapSection";
import ListSection from "./components/ListSection";
import { displayElevation } from "@/utils/unitConversions";
import WainwrightsHero from "./components/WainwrightsHero";

type MetadataProps = {
  searchParams: Promise<{
    [key: string]: string | undefined;
  }>;
};

export async function generateMetadata({ searchParams }: MetadataProps) {
  const { book } = await searchParams;

  if (book && BookTitles[Number(book)]) {
    const bookTitle = BookTitles[Number(book)];

    return createPageMetadata({
      title: `${bookTitle} Interactive Wainwright Map`,
      description: `Discover the Wainwright fells of the ${bookTitle} in the Lake District. Explore them with an interactive map and searchable list of fells.`,
      path: `/wainwrights?book=${book}`,
    });
  } else {
    return createPageMetadata({
      title: "The 214 Wainwrights Interactive Map",
      description:
        "Discover all 214 Wainwrights in the Lake District with an interactive map and searchable list of fells.",
      path: "/wainwrights",
    });
  }
}

export type SimplifiedHill = {
  slug: Hill["slug"];
  name: Hill["name"];
  secondaryName: Hill["secondaryName"];
  height: Hill["height"];
  prominence: Hill["prominence"];
  book: Hill["book"];
  walks: string[];
};

export default async function WainwrightsPage({ searchParams }: MetadataProps) {
  const { book } = await searchParams;

  const simplifiedHillData = (wainsJson as Hill[]).map(
    (hill) =>
      ({
        slug: hill.slug,
        name: hill.name,
        secondaryName: hill.secondaryName,
        height: hill.height,
        prominence: hill.prominence,
        book: hill.book,
        walks: walksJson
          .filter((walk) => walk.wainwrights?.includes(hill.slug))
          .map((walk) => walk.slug),
      }) as SimplifiedHill,
  );

  const hillMarkers = getHillMarkers();

  const mapBounds = getMapBounds(
    [
      Math.min(...hillMarkers.map((p) => p.coordinates[0])),
      Math.max(...hillMarkers.map((p) => p.coordinates[0])),
    ],
    [
      Math.min(...hillMarkers.map((p) => p.coordinates[1])),
      Math.max(...hillMarkers.map((p) => p.coordinates[1])),
    ],
  );

  return (
    <main className={styles.page}>
      <WainwrightsHero book={book} />

      <MapSection
        simplifiedHillData={simplifiedHillData}
        hillMarkers={hillMarkers}
        mapBounds={mapBounds}
      />

      <ListSection simplifiedHills={simplifiedHillData} book={0} />

      <section>
        <h2>Stats and facts</h2>
        <p>Tallest Wainwright: Scafell Pike - {displayElevation(978)}</p>
        <p>Shortest Wainwright: Castle Crag - {displayElevation(270)}</p>
      </section>
    </main>
  );
}
