import formatDateString from "@/utils/formatDateString";
import React from "react";

export default function ForecastDate({ dateString }: { dateString?: string }) {
  if (!dateString) return <></>;

  const getDayName = (inputDate: Date) => {
    const isSameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    const todaysDate = new Date();
    const tomorrowsDate = new Date(todaysDate);
    tomorrowsDate.setDate(todaysDate.getDate() + 1);

    if (isSameDay(inputDate, todaysDate)) {
      return "Today";
    }
    if (isSameDay(inputDate, tomorrowsDate)) {
      return "Tomorrow";
    }

    return undefined;
  };

  const [day, date] = formatDateString(dateString);
  const relativeDay = getDayName(new Date(dateString));

  if (relativeDay)
    return (
      <>
        {relativeDay}{" "}
        <span>
          {day} {date}
        </span>
      </>
    );
  else
    return (
      <>
        {day} <span>{date}</span>
      </>
    );
}
