import { createPageMetadata } from "@/utils/metadata";
import HeroSection from "./sections/HeroSection";

export async function generateMetadata() {
  return createPageMetadata({
    title: "The 214 Wainwrights Interactive Map",
    description:
      "Discover all 214 Wainwrights in the Lake District with an interactive map and searchable list of fells.",
    path: "/wainwrights",
  });
}

export default async function AllWainwrightsPage() {
  return <HeroSection />;
}
