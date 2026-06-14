import { createPageMetadata } from "@/utils/metadata";
import HeroSection from "../../sections/HeroSection";
import { regionSlugs } from "../../constants";
import { BookTitles } from "@/types/Hill";

type ParamsProps = {
  params: Promise<{ region: string }>;
};

export async function generateMetadata({ params }: ParamsProps) {
  const { region } = await params;
  const regionVal = regionSlugs[String(region)];
  const regionName = BookTitles[regionVal];
  console.log(region, regionVal, regionName);

  return createPageMetadata({
    title: `${regionName} Interactive Wainwright Map`,
    description: `Discover the Wainwright fells of the ${regionName} in the Lake District. Explore them with an interactive map and searchable list of fells.`,
    path: `/wainwrights/region/${region}`,
  });
}

export default async function page({ params }: ParamsProps) {
  const { region } = await params;
  return <HeroSection region={regionSlugs[String(region)]} />;
}
