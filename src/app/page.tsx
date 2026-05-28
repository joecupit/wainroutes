import styles from "./Home.module.css";
import fontStyles from "@/styles/fonts.module.css";
import buttonStyles from "@/styles/buttons.module.css";

import Script from "next/script";
import Link from "next/link";
import { createPageMetadata } from "@/utils/metadata";

import HomeSearchBar from "@/components/HomeSearchBar/HomeSearchBar";
import WalkCard from "@/components/WalkCard/WalkCard";

import Walk from "@/types/Walk";

import tempwalks from "@/data/walks.json";
import LazyPicture from "@/components/LazyImage/LazyPicture";
import { ArrowRightIcon } from "@/icons/PhosphorIcons";
import LazyImage from "@/components/LazyImage/LazyImage";

export function generateMetadata() {
  return createPageMetadata({
    title: "Wainroutes Lake District Walks",
    path: "/",
  });
}

export default function Home() {
  const featuredWalkSlugs = [
    "high-rigg-from-thirlmere",
    "little-and-great-mell-fell",
    "the-old-man-of-coniston",
    "skiddaw-and-little-man",
  ];
  const walks = tempwalks as unknown as Walk[];
  const featuredWalks = featuredWalkSlugs.map((slug) =>
    walks.find((w) => w.slug === slug),
  );

  return (
    <>
      <Script
        id="website-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: `{
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Wainroutes",
            "url": "https://wainroutes.co.uk/"
          }`,
        }}
      />

      <main className={styles.home}>
        <section className={styles.heroSection}>
          <div className={styles.hero}>
            <div className={styles.heroText}>
              <h1 className={`${fontStyles.title} ${styles.title}`}>
                Wainwright Walks in the Lake District
              </h1>
            </div>

            <HomeSearchBar />
          </div>
          <div className={styles.heroImageOverlay} />
          <div className={styles.heroImage}>
            <LazyPicture
              names={["home/01", "home/02"]}
              widths={[700]}
              sizes="200vw"
              eager={true}
            />
          </div>
        </section>

        <section>
          <div className={styles.featured}>
            <div className={styles.featuredTitle}>
              <div>
                <h2 className={fontStyles.subheading}>Featured Routes</h2>
                <p>New and popular walks on Wainroutes.</p>
              </div>
              <div>
                <Link
                  href="/walks"
                  className={`${buttonStyles.button} ${buttonStyles.text} ${buttonStyles.animate}  ${styles.featuredWalkButton}`}
                  draggable="false"
                >
                  View all walks <ArrowRightIcon />
                </Link>
              </div>
            </div>
            <div className={styles.featuredGroup}>
              {featuredWalks.map((walk, index) => {
                return walk && <WalkCard key={index} walk={walk} />;
              })}
            </div>
            <Link
              href="/walks"
              className={`${buttonStyles.button} ${buttonStyles.animate} ${styles.featuredWalkButtonMobile}`}
              draggable="false"
            >
              View all walks <ArrowRightIcon />
            </Link>
          </div>
        </section>

        <section className={styles.wainwrightsSection}>
          <div className={styles.wainwrights}>
            <div className={styles.wainwrightsMain}>
              <h2 className={fontStyles.heading}>The 214 Wainwrights</h2>
              <div className={styles.wainwrightsText}>
                <p>
                  In his <i>Pictorial Guide to the Lakeland Fells</i>, Alfred
                  Wainwright illustrated and described 214 fells across the Lake
                  District. Together they&apos;re known as the Wainwrights, and
                  summiting them all has become a popular goal among walkers.
                </p>
                <p>
                  Check out the list of fells or learn more about the man
                  himself.
                </p>
              </div>
              <div className={styles.wainwrightsButtons}>
                <Link
                  href="/wainwrights"
                  className={`${buttonStyles.button} ${buttonStyles.animate}`}
                  draggable="false"
                >
                  Explore all Wainwrights <ArrowRightIcon />
                </Link>
                <Link
                  href="/about/alfred-wainwright"
                  className={`${buttonStyles.button} ${buttonStyles.underlined}`}
                  draggable="false"
                >
                  Learn more about A. Wainwright
                </Link>
              </div>
            </div>
            <LazyImage
              name="home/wainwright_map.webp"
              alt="Map of the Wainwrights"
              maxWidth={1024}
              className={styles.wainwrightsMap}
            />
          </div>
        </section>

        <section>
          <div className={styles.about}>
            <div className={styles.aboutImage}>
              <LazyPicture
                names={[
                  "home/a-hiker-stood-at-the-cairn-on-high-street.webp",
                  "home/a-hiker-stood-at-the-cairn-on-high-street-mobile.webp",
                ]}
                widths={[800]}
                sizes="(min-width: 801px) 480px, 100vw"
                alt="A hiker stood at the cairn on High Street"
              />
            </div>
            <div className={styles.aboutText}>
              <h2 className={fontStyles.heading}>About Wainroutes</h2>
              <p>
                Wainroutes is a guide to walking the Lake District&apos;s
                Wainwrights, shaped by my own goal to climb all 214. Here I
                share the routes I&apos;ve followed, photos I&apos;ve taken, and
                resources I rely on when planning walks.
              </p>
              <Link
                href="/about"
                className={`${buttonStyles.button} ${buttonStyles.animate}`}
              >
                Read more about Wainroutes <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
