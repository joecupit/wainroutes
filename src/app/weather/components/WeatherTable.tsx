"use client";

import styles from "../Weather.module.css";

import { DistrictWeatherDayForecast } from "@/types/Weather";
import { RenderWeatherIcon } from "@/utils/RenderWeatherIcon";
import { useState } from "react";
import SelectDropdown from "./SelectDropdown";

export default function WeatherTable({
  forecast,
}: {
  forecast?: DistrictWeatherDayForecast;
}) {
  const heightOptions = ["900m", "600m", "300m", "Valley"];
  const [height, setHeight] = useState("900m");

  if (forecast === undefined) return <p>Unavailable.</p>;
  const sliceIndex = forecast.time.indexOf("06:00");

  return (
    <>
      <h3 className={styles.boldheading}>
        Mountain Forecast
        <SelectDropdown
          label="height"
          value={height}
          onChange={(val) => setHeight(val)}
          options={Object.fromEntries(heightOptions.map((opt) => [opt, opt]))}
        />
      </h3>
      <div className={styles.weatherTableContainer}>
        <table className={styles.weatherTable}>
          <thead>
            <tr className={styles.primaryRow}>
              <th></th>
              {forecast.time.slice(sliceIndex).map((time, index) => (
                <th key={index}>{time}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className={styles.emtpyRow}></tr>
            {forecast.type && (
              <WeatherTypeRow
                icon="Type"
                title="Weather type"
                data={forecast.type}
                sliceIndex={sliceIndex}
                className={styles.primaryRow}
              />
            )}
            {forecast.precip && (
              <WeatherTableRow
                icon="Precip"
                title="Precipitation %"
                data={forecast.precip}
                sliceIndex={sliceIndex}
                className={styles.primaryRow}
              />
            )}
            <tr className={styles.emtpyRow}></tr>
            {forecast.temp_c && (
              <WeatherTableRow
                icon="Temp"
                title="Temperature"
                data={forecast.temp_c[height]}
                postText={"°C"}
                sliceIndex={sliceIndex}
                className={styles.primaryRow}
              />
            )}
            {forecast.feel_temp_c && (
              <WeatherTableRow
                icon="Feels"
                title="Feels-like"
                data={forecast.feel_temp_c[height]}
                postText={"°C"}
                sliceIndex={sliceIndex}
                className={styles.secondaryRow}
              />
            )}
            <tr className={styles.emtpyRow}></tr>
            {forecast.wind_speed_kph && (
              <WeatherTableRow
                icon="Wind"
                title="Wind speed"
                data={forecast.wind_speed_kph[height]}
                postText={"kph"}
                sliceIndex={sliceIndex}
                className={styles.primaryRow}
              />
            )}
            {forecast.wind_gust_kph && (
              <WeatherTableRow
                icon="Gusts"
                title="Wind gusts"
                data={forecast.wind_gust_kph[height]}
                postText={"kph"}
                sliceIndex={sliceIndex}
                className={styles.secondaryRow}
              />
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function WeatherTableRow({
  icon,
  title,
  data,
  postText,
  sliceIndex,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  data: number[] | string[];
  postText?: string;
  sliceIndex?: number;
  className?: string;
}) {
  if (!sliceIndex) {
    sliceIndex = 0;
  }

  return (
    <tr className={className}>
      <th>
        {icon && <span className={styles.rowIcon}>{icon}</span>}
        <span className={styles.rowTitle}>{title}</span>
      </th>
      {data.slice(sliceIndex).map((entry, index) => (
        <td key={index}>
          {entry}
          {postText}
        </td>
      ))}
    </tr>
  );
}
function WeatherTypeRow({
  icon,
  title,
  data,
  sliceIndex,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  data: string[];
  sliceIndex?: number;
  className?: string;
}) {
  if (!sliceIndex) {
    sliceIndex = 0;
  }

  return (
    <tr className={className}>
      <th>
        {icon && <span className={styles.rowIcon}>{icon}</span>}
        <span className={styles.rowTitle}>{title}</span>
      </th>
      {data.slice(sliceIndex).map((entry, index) => {
        return (
          <td key={index} className={styles.imageCell} title={entry}>
            {RenderWeatherIcon(entry)}
          </td>
        );
      })}
    </tr>
  );
}
