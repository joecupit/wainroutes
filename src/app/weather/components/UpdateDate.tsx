"use client";

export default function UpdateDate({ date }: { date: string }) {
  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDayName = (inputDate: Date) => {
    const isSameDay = (a: Date, b: Date) =>
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate();

    const todaysDate = new Date();
    const yesterdaysDate = new Date(todaysDate);
    yesterdaysDate.setDate(todaysDate.getDate() - 1);

    if (isSameDay(inputDate, todaysDate)) {
      return "Today";
    }
    if (isSameDay(inputDate, yesterdaysDate)) {
      return "Yesterday";
    }

    return `${weekdays[inputDate.getDay()]} ${inputDate.getDate()} ${months[inputDate.getMonth()].slice(0, 3)}`;
  };

  const updateDate = new Date(date);

  var howLongAgo = "";

  const delta_min = (+new Date() - +updateDate) / 1000 / 60;

  if (delta_min < -10) {
    howLongAgo = "";
  } else if (delta_min < 1) {
    howLongAgo = "Just now";
  } else if (delta_min < 60) {
    howLongAgo = `${Math.trunc(delta_min)}m ago`;
  } else if (delta_min < 60 * 24) {
    howLongAgo = `${Math.trunc(delta_min / 60)}h ago`;
  } else {
    howLongAgo = `${Math.trunc(delta_min / 60 / 24)}d ago`;
  }

  return (
    <span
      title={`${updateDate.toDateString()}, ${updateDate.toLocaleTimeString()}`}
      aria-date={date}
    >
      {`${getDayName(updateDate)}
        at
        ${updateDate.toTimeString().slice(0, 5)}
        ${howLongAgo.length > 0 ? `(${howLongAgo})` : ""}
        `}
    </span>
  );
}
