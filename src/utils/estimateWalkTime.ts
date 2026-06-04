import { TerrainLevel } from "@/types/Walk";

export default function estimateWalkTime(
  walkLength: number,
  walkElevation: number,
  walkGradient: TerrainLevel,
) {
  const horizontalSpeedKph = {
    1: 2.25,
    2: 3,
    3: 4,
    4: 5,
  };
  const minsPer300m = {
    1: 39,
    2: 37,
    3: 34,
    4: 30,
  };
  const steepnessFix = {
    1: -5,
    2: 0,
    3: 5,
    4: 15,
  };

  const timeStrings = {
    1: "",
    2: "",
    3: "",
    4: "",
  };

  Object.keys(timeStrings).forEach((key) => {
    const speedLevel = Number(key) as 1 | 2 | 3 | 4;

    const horizontalMins = (walkLength / horizontalSpeedKph[speedLevel]) * 60;
    const elevationCorrectionMins =
      (walkElevation / 300) *
      (minsPer300m[speedLevel] + steepnessFix[walkGradient]);

    const totalMins =
      Math.ceil((horizontalMins + elevationCorrectionMins) / 5) * 5;
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins - hours * 60;

    timeStrings[speedLevel] = `${
      hours > 0 ? `${hours} hour${hours !== 1 ? "s" : ""} ` : ""
    }${mins} mins`;
  });

  return timeStrings;
}
