"use client";

import { useSearchParams } from "next/navigation";
import { SimplifiedHill } from "../page";
import WainwrightList from "./WainwrightList";

type WainwrightListProps = {
  simplifiedHills: SimplifiedHill[];
  book: number;
};

export default function ListSection({ simplifiedHills }: WainwrightListProps) {
  const searchParams = useSearchParams();
  const book = Number(searchParams.get("book"));

  return (
    <section>
      <h2>Complete List of Wainwrights</h2>
      <WainwrightList simplifiedHills={simplifiedHills} book={book} />
    </section>
  );
}
