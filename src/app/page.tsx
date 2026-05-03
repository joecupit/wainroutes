import styles from "./Home.module.css";
import fontStyles from "@/styles/fonts.module.css";
import buttonStyles from "@/styles/buttons.module.css";

import Script from "next/script";
import Link from "next/link";
import { createPageMetadata } from "@/utils/metadata";

import HomeSearchBar from "@/components/HomeSearchBar/HomeSearchBar";
import WalkCard from "@/components/WalkCard/WalkCard";
import WalkCardStyles from "@/components/WalkCard/WalkCard.module.css";
import LakeMap from "@/components/Map/Map";

import Walk from "@/types/Walk";
import { getHillMarkers } from "@/utils/getMapMarkers";

import tempwalks from "@/data/walks.json";
import LazyPicture from "@/components/LazyImage/LazyPicture";
import { ArrowRightIcon } from "@/icons/PhosphorIcons";
import { DistrictWeather } from "@/types/Weather";
import formatDateString from "@/utils/formatDateString";
import { displayTemperature } from "@/utils/unitConversions";
import { RenderWeatherIcon } from "@/utils/RenderWeatherIcon";

export function generateMetadata() {
  return createPageMetadata({
    title: "Wainroutes Lake District Walks",
    path: "/",
  });
}

export default function Home() {
  const featuredWalkSlugs = [
    "buttermere-to-keswick",
    "dodd-and-dodd-wood",
    "helvellyn-via-striding-edge",
    "uldale-fells-circular",
  ];
  const walks = tempwalks as unknown as Walk[];
  const featuredWalks = featuredWalkSlugs.map((slug) =>
    walks.find((w) => w.slug === slug),
  );

  const hillMarkers = getHillMarkers();

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
            <h1 className={`${fontStyles.title} ${styles.title}`}>
              Wainwright Walks in the Lake District
            </h1>

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
                  className={`${buttonStyles.button} ${buttonStyles.text} ${buttonStyles.animate}`}
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
            {/* <Link
              href="/walks"
              className={`${buttonStyles.button}`}
              draggable="false"
            >
              Browse all walks
            </Link> */}
          </div>
        </section>
        <section className={styles.wainwrightsSection}>
          <div className={styles.wainwrights}>
            <div>
              <h2 className={fontStyles.heading}>The 214 Wainwrights</h2>
              <div className={styles.wainwrightsText}>
                <p>
                  The Wainwrights are 214 fells in the Lake District collected
                  by A. Wainwright in his seven-volume{" "}
                  <i>Pictorial Guide to the Lakeland Fells</i>. Each book covers
                  a different region, with hand-drawn maps, route details, and
                  notes on the landscape.
                </p>
                <p>
                  Since the first volume was published in 1955,
                  Wainwright&apos;s writing has inspired many to get out and
                  explore the Lakes, with plenty of walkers aiming to summit the
                  full set.
                </p>
                <p>
                  Here you&apos;ll find a collection of routes I&apos;ve used so
                  far on my own journey to complete the Wainwrights. Whether
                  you&apos;re aiming for all 214 or just looking for your next
                  day out in the fells, I hope these walks help you enjoy the
                  Lakes.
                </p>
              </div>
              <Link
                href="/wainwrights"
                className={`${buttonStyles.button} ${buttonStyles.animate}`}
                draggable="false"
              >
                Go to list of Wainwrights <ArrowRightIcon />
              </Link>
            </div>
            <div className={styles.wainwrightsMap}>
              <LakeMap primaryMarkers={hillMarkers} />
            </div>
          </div>
        </section>

        <HomeWeather />

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
              <p>
                Whether you&apos;re bagging Wainwrights or just looking for a
                day out in the fells, I hope Wainroutes makes it easier to enjoy
                the Lakes as much as I do.
              </p>
              <Link
                href="/about"
                className={`${buttonStyles.button} ${buttonStyles.secondary} ${buttonStyles.animate}`}
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

async function getWeather() {
  const res = await fetch("https://data.wainroutes.co.uk/weather.json", {
    next: { revalidate: 1800 },
  });

  if (!res.ok) {
    console.error("Failed to fetch weather data:", res);
    return {};
  }

  return res.json();
}

const getWeatherTitle = (dateString: string) => {
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const todaysDate = new Date();
  const tomorrowsDate = new Date(todaysDate);
  tomorrowsDate.setDate(todaysDate.getDate() + 1);

  const inputDate = new Date(dateString);

  if (isSameDay(inputDate, todaysDate)) {
    return "Today's Mountain Conditions";
  }
  if (isSameDay(inputDate, tomorrowsDate)) {
    return "Tomorrow's Mountain Conditions";
  }

  return `Mountain Conditions for ${formatDateString(dateString)}`;
};

const getMostCommonFromArray = (array: string[]) => {
  return Object.entries(
    array.reduce((a, v) => {
      a[v] = (a[v] ?? 0) + 1;
      return a;
    }, {}),
  ).reduce((a, v) => (v[1] >= a[1] ? v : a), [null, 0])[0];
};

async function HomeWeather() {
  const weatherData: DistrictWeather = await getWeather();

  let currentWeather = weatherData.days.find(
    (day) => day.type == "current-day",
  );
  if (currentWeather === undefined || currentWeather.date === undefined) {
    return "No weather";
  }

  // console.log(currentWeather);

  return (
    <section>
      <div className={styles.weather}>
        <div className={styles.weatherOverview}>
          <div className={styles.weatherOverviewOverlay}></div>
          <div>
            <h2 className={fontStyles.heading}>
              {getWeatherTitle(currentWeather.date)}
            </h2>
            <p className={styles.weatherDate}>
              {formatDateString(currentWeather.date)}
            </p>
          </div>
          <div className={styles.weatherOverviewOverview}>
            <div>
              {currentWeather.forecast?.type &&
                RenderWeatherIcon(
                  getMostCommonFromArray(currentWeather.forecast?.type),
                )}
              <div>
                <p className={styles.weatherTemp}>
                  {displayTemperature(
                    Math.max(
                      ...currentWeather.forecast?.temp?.map((t) => Number(t)),
                    ),
                  )}
                </p>
                <p>
                  Feels like{" "}
                  {displayTemperature(
                    Math.max(
                      ...currentWeather.forecast?.feel_temp?.map((t) =>
                        Number(t),
                      ),
                    ),
                  )}
                </p>
              </div>
            </div>
            <hr />
            <p className={styles.weatherWeather}>{currentWeather.weather}</p>
          </div>
        </div>

        <div className={styles.weatherGrid}>
          <div>
            <h3>Sunrise / Sunset</h3>
            <p>
              {currentWeather.sunrise} / {currentWeather.sunset}
            </p>
          </div>
          {currentWeather.cloud_free_top && (
            <div>
              <h3>Chance of Cloud-Free Hill Top</h3>
              <p data-small={currentWeather.cloud_free_top?.length > 7}>
                {currentWeather.cloud_free_top}
              </p>
            </div>
          )}
          {currentWeather.forecast?.wind_speed &&
            currentWeather.forecast?.wind_dir && (
              <div>
                <h3>Wind speeds</h3>
                <p>
                  {Math.max(
                    ...currentWeather.forecast?.wind_speed?.map((t) =>
                      Number(t),
                    ),
                  )}
                  mph{" "}
                  {getMostCommonFromArray(currentWeather.forecast?.wind_dir)}
                </p>
              </div>
            )}
          {currentWeather.forecast?.wind_dir &&
            currentWeather.forecast?.wind_gust && (
              <div>
                <h3>Wind gusts</h3>
                <p>
                  {Math.max(
                    ...currentWeather.forecast?.wind_gust?.map((t) =>
                      Number(t),
                    ),
                  )}
                  mph{" "}
                  {getMostCommonFromArray(currentWeather.forecast?.wind_dir)}
                </p>
              </div>
            )}
          {currentWeather.forecast?.precip && (
            <div>
              <h3>Precipitation</h3>
              <p>
                {Math.max(
                  ...currentWeather.forecast?.precip?.map((t) =>
                    Number(t.match(/\d+/g)),
                  ),
                )}
                %
              </p>
            </div>
          )}
        </div>
        <Link
          href="/weather"
          className={`${buttonStyles.button} ${buttonStyles.animate} ${styles.weatherButton}`}
        >
          View full 5-day mountain forecast <ArrowRightIcon />
        </Link>
      </div>
    </section>
  );
}
