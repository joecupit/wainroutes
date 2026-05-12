import WeatherIcons from "@/icons/WeatherIcons";

export function RenderWeatherIcon(uncleanString: string) {
  const slug = uncleanString
    .toLowerCase()
    .replaceAll(" ", "-")
    .replaceAll(/[()]/g, "");
  const Icon = WeatherIcons[slug];

  if (Icon) return <Icon />;
  else {
    const NoIcon = WeatherIcons["na"];
    return <NoIcon />;
  }
}
