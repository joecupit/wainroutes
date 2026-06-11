import { SimplifiedHill } from "../page";
import WainwrightList from "./WainwrightList";

type WainwrightListProps = {
  simplifiedHills: SimplifiedHill[];
  book?: string;
};

export default function ListSection({
  simplifiedHills,
  book,
}: WainwrightListProps) {
  return (
    <section>
      <h2>Complete List of Wainwrights</h2>
      <WainwrightList simplifiedHills={simplifiedHills} book={Number(book)} />
    </section>
  );
}
