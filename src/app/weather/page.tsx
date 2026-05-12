import styles from "./Weather.module.css";
import fontStyles from "@/styles/fonts.module.css";

import { createPageMetadata } from "@/utils/metadata";

import { DistrictWeather } from "@/types/Weather";
import { Forecast } from "./components/Forecast";
import LazyImage from "@/components/LazyImage/LazyImage";
import UpdateDate from "./components/UpdateDate";

export function generateMetadata() {
  return createPageMetadata({
    title: "Lake District Mountain Weather Forecast",
    description:
      "Get the latest 5-day mountain weather forecast for the Lake District, with summit visibility and current mountain hazards.",
    path: "/weather",
  });
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

export default async function WeatherPage() {
  const weatherData: DistrictWeather = await getWeather();

  return (
    <main className={styles.weather}>
      <section className={styles.heroSection}>
        <div className={styles.hero}>
          <h1 id="walks-title" className={fontStyles.title}>
            Lake District Weather Forecast
          </h1>
        </div>
        <div>
          <LazyImage
            className={styles.heroImage}
            name={"walks/bessyboot-rosthwaite-fell/01.webp"}
            sizes="100vw"
            alt={""}
          />
        </div>
      </section>

      <section className={styles.updateTime}>
        {weatherData.days.length > 0 && (
          <p>
            Last updated: <UpdateDate date={weatherData.update_time} />
          </p>
        )}
      </section>

      <section>
        <div className={styles.main}>
          {weatherData.days.length > 0 ? (
            <Forecast weatherData={weatherData} />
          ) : (
            <div className={styles.noweather}>
              Forecast temporarily unavailable. For mountain conditions use the{" "}
              <a
                href="https://weather.metoffice.gov.uk/specialist-forecasts/mountain/lake-district"
                target="_blank"
              >
                Met Office forecast
              </a>
              .
            </div>
          )}

          <div style={{ height: "3rem" }}></div>
        </div>
      </section>
    </main>
  );
}
