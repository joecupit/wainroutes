"use client";

import styles from "../WalkCard.module.css";

import React from "react";

function isWithinOneMonthAgo(dateInput: string) {
  const inputDate = new Date(dateInput);
  const now = new Date();

  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);

  return inputDate >= oneMonthAgo && inputDate <= now;
}

export default function NewTag({ date }: { date?: string }) {
  if (date === undefined) return <></>;
  if (!isWithinOneMonthAgo(date)) return <></>;

  return <div className={styles.newTag}>New!</div>;
}
