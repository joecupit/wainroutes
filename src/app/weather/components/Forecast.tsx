import styles from "../Weather.module.css";
import fontStyles from "@/styles/fonts.module.css";

import { Fragment } from "react";

import { DistrictWeather, DistrictWeatherDay } from "@/types/Weather";
import WeatherTable from "./WeatherTable";
import ForecastDate from "./ForecastDate";

export function Forecast({ weatherData }: { weatherData: DistrictWeather }) {
  return (
    <div className={styles.forecast}>
      {/* <h2>5-day mountain forecast</h2> */}

      {weatherData?.days?.map((day, index) => {
        switch (day.type) {
          case "current-day":
            return <TodayForecast key={index} weather={day} />;
          case "tomorrows-tab":
            return <TomorrowForecast key={index} weather={day} />;
          case "further-outlook":
            return <FutureForecast key={index} weather={day} />;
          default:
            return <Fragment key={index}></Fragment>;
        }
      })}

      <p className={styles.metoffice}>
        Forecast provided by the{" "}
        <a href="https://www.metoffice.gov.uk/" target="_blank">
          Met Office
        </a>{" "}
        under the{" "}
        <a
          href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
          target="_blank"
        >
          Open Government Licence
        </a>
        .
      </p>
    </div>
  );
}

function ForecastDay({
  sticky,
  main,
}: {
  sticky: React.ReactNode;
  main: React.ReactNode;
}) {
  return (
    <div className={styles.forecastRow}>
      <div className={styles.forecastSticky}>{sticky}</div>
      <div className={styles.forecastMain}>{main}</div>
    </div>
  );
}

function TodayForecast({ weather }: { weather: DistrictWeatherDay }) {
  return (
    <ForecastDay
      sticky={
        <>
          <div>
            <h2 className={styles.forecastDate}>
              <ForecastDate dateString={weather.date} />
            </h2>
          </div>
          <div className={styles.additionalInfo}>
            <div>
              <h3 className={styles.boldheading}>Mountain Hazards</h3>
              <MountainHazardList hazards={weather.hazards} />
            </div>
            <div>
              <h3 className={styles.boldheading}>Meteorologist&apos;s View</h3>
              <MeteorologistView view={weather.meteorologist_view} />
            </div>
          </div>
        </>
      }
      main={
        <>
          <div>
            <h3 className="visually-hidden">Summary</h3>
            <p>{weather.summary}</p>
          </div>
          <div className={styles.forecastTable}>
            <WeatherTable forecast={weather.forecast} />
          </div>
          <div>
            <h3 className={styles.boldheading}>
              Chance of Cloud-Free Hill Top
            </h3>
            <p>{weather.cloud_free_top}</p>
          </div>
          <div>
            <h3 className={styles.boldheading}>Visibility</h3>
            <p>{weather.visibility}</p>
          </div>
          <div className={styles.additionalInfo}>
            <div>
              <h3 className={styles.boldheading}>Mountain Hazards</h3>
              <MountainHazardList hazards={weather.hazards} />
            </div>
            <div>
              <h3 className={styles.boldheading}>Meteorologist&apos;s View</h3>
              <MeteorologistView view={weather.meteorologist_view} />
            </div>
          </div>
          <p className={styles.suntime}>
            Sunrise: {weather.sunrise}, Sunset: {weather.sunset}
          </p>
        </>
      }
    />
  );
}

function TomorrowForecast({ weather }: { weather: DistrictWeatherDay }) {
  return (
    <ForecastDay
      sticky={
        <>
          <div>
            <h2 className={styles.forecastDate}>
              <ForecastDate dateString={weather.date} />
            </h2>
          </div>
        </>
      }
      main={
        <>
          <div>
            <h3 className="visually-hidden">Summary</h3>
            <p>{weather.summary}</p>
          </div>
          <div>
            <h3 className={styles.boldheading}>
              Chance of Cloud-Free Hill Top
            </h3>
            <p>{weather.cloud_free_top}</p>
          </div>
          <div>
            <h3 className={styles.boldheading}>Visibility</h3>
            <p>{weather.visibility}</p>
          </div>
          <div>
            <h3 className={styles.boldheading}>Wind</h3>
            <p>{weather.max_wind}</p>
          </div>
          <div>
            <h3 className={styles.boldheading}>Temperature</h3>
            {weather.temperature && (
              <ul className={styles.temperatureList}>
                {Object.keys(weather.temperature).map((loc, index) => {
                  return (
                    <li key={index}>
                      {loc}: {weather.temperature?.[loc]}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <p className={styles.suntime}>
            Sunrise: {weather.sunrise}, Sunset: {weather.sunset}
          </p>
        </>
      }
    />
  );
}

function FutureForecast({ weather }: { weather: DistrictWeatherDay }) {
  const weekdayDict = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday",
  } as { [shorthand: string]: string };
  const monthDict = {
    Jan: "January",
    Feb: "February",
    Mar: "March",
    Apr: "April",
    May: "May",
    Jun: "June",
    Jul: "July",
    Aug: "August",
    Sep: "September",
    Oct: "October",
    Nov: "November",
    Dec: "December",
  } as { [shorthand: string]: string };

  return (
    <div className={styles.futureForecast}>
      <h2 className={`${fontStyles.heading} ${styles.furtherTitle}`}>
        Further Outlook
      </h2>

      {weather.days?.map((day, index) => {
        const dateList = day.date.split(" ");
        dateList[0] = weekdayDict[dateList[0]];
        dateList[2] = monthDict[dateList[2]].slice(0, 3);

        return (
          <ForecastDay
            key={index}
            sticky={
              <>
                <h3 className={styles.forecastDate}>
                  {dateList[0]} <span>{dateList.slice(1).join(" ")}</span>
                </h3>
              </>
            }
            main={
              <>
                <h3 className="visually-hidden">Summary</h3>
                <p>{day.summary}</p>
                <p className={styles.suntime}>
                  Sunrise: {day.sunrise}, Sunset: {day.sunset}
                </p>
              </>
            }
          />
        );
      })}
    </div>
  );
}

//

export function MountainHazardList({
  hazards,
}: {
  hazards?: DistrictWeatherDay["hazards"];
}) {
  if (!hazards) return "None reported.";

  const renderHazards = (level: string, hazards?: string[]) => {
    if (!hazards) return <></>;

    return hazards.map((hazard, index) => {
      return (
        <li key={index} className={`${styles.mountainHazard} ${level}`}>
          {hazard}
        </li>
      );
    });
  };

  return (
    <ul className={styles.mountainHazards}>
      {renderHazards(styles.high, hazards.high)}
      {renderHazards(styles.medium, hazards.medium)}
      {renderHazards(styles.low, hazards.low)}
    </ul>
  );
}

function MeteorologistView({
  view,
}: {
  view?: DistrictWeatherDay["meteorologist_view"];
}) {
  if (view && !view.startsWith("Nothing")) {
    return <p className={styles.meteorologistView}>{view}</p>;
  }

  return <p>{view ?? "Nothing to add."}</p>;
}
