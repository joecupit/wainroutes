import { displayDistance, displayElevation } from "@/utils/unitConversions";

type Location = {
  name: string;
  coords: [number, number];
  distScale?: number;
} | null;
type Locations = {
  [name: string]: Location;
};

export const locations: Locations = {
  "keswick": { name: "Keswick", coords: [-3.1347, 54.6013] },
  "ambleside": { name: "Ambleside", coords: [-2.9613, 54.4287] },
  "grasmere": { name: "Grasmere", coords: [-3.0244, 54.4597] },
  "buttermere": { name: "Buttermere", coords: [-3.2766, 54.5413] },
  "borrowdale": { name: "Borrowdale", coords: [-3.1486, 54.5028] },
  "coniston": { name: "Coniston", coords: [-3.0759, 54.3691] },
  "glenridding": { name: "Glenridding", coords: [-2.9498, 54.5448] },
  "windermere": { name: "Windermere", coords: [-2.9068, 54.3807] },

  "dungeon-ghyll": { name: "Dungeon Ghyll", coords: [-3.0942, 54.4461] },
  "kentmere": { name: "Kentmere", coords: [-2.8402, 54.4302] },
  "seatoller": { name: "Seatoller", coords: [-3.1678, 54.5142] },
  "braithwaite": { name: "Braithwaite", coords: [-3.1923, 54.6026] },
  "wasdale-head": { name: "Wasdale Head", coords: [-3.2966, 54.466] },
  "thirlmere": { name: "Thirlmere", coords: [-3.0642, 54.5365] },
  "thornthwaite": { name: "Thornthwaite", coords: [-3.2029, 54.6173] },
  "rosthwaite": { name: "Rosthwaite", coords: [-3.1466, 54.5228] },
  "whinlatter-pass": { name: "Whinlatter Pass", coords: [-3.2256, 54.6082] },
  "threlkeld": { name: "Threlkeld", coords: [-3.0543, 54.619] },
  "dodd-wood": { name: "Dodd Wood", coords: [-3.1868, 54.6428] },
  "matterdale": { name: "Matterdale", coords: [-2.912, 54.5951] },
  "troutbeck": { name: "Troutbeck", coords: [-2.9146, 54.4157] },
  "hartsop": { name: "Hartsop", coords: [-2.914, 54.5097] },

  "penrith": { name: "Penrith", coords: [-2.7584, 54.6619], distScale: 2 },
  "cockermouth": {
    name: "Cockermouth",
    coords: [-3.3647, 54.6623],
    distScale: 2,
  },
  "kendal": { name: "Kendal", coords: [-2.7403, 54.3321], distScale: 2 },
  "stavely": { name: "Stavely", coords: [-2.8184, 54.3756], distScale: 1.5 },
  "oxenholme": {
    name: "Oxenholme",
    coords: [-2.7216, 54.3048],
    distScale: 2.25,
  },
  "bassenthwaite": { name: "Bassenthwaite", coords: [-3.1953, 54.6795] },
  "tarn-hows": { name: "Tarn Hows", coords: [-3.0368, 54.3881] },
  "elterwater": { name: "Elterwater", coords: [-3.0378, 54.4342] },
  "mungrisdale": { name: "Mungrisdale", coords: [-2.9883, 54.6645] },
  "stoneycroft": { name: "Stoneycroft", coords: [-3.1889, 54.5809] },
  "longlands": { name: "Longlands", coords: [-3.1391, 54.7139] },
};

const distanceDelimiters = [0, 6, 12, 18];
export const distanceValues = Object.fromEntries(
  distanceDelimiters.map((k, i) =>
    i + 1 < distanceDelimiters.length
      ? [k + "-" + distanceDelimiters[i + 1], [k, distanceDelimiters[i + 1]]]
      : [k + "+", [k]],
  ),
);
export const distanceOptions: { [key: string]: string } = {
  any: "Any distance",
  ...Object.fromEntries(
    Object.entries(distanceValues).map(([k, v]) => [
      k,
      (v[0] == 0
        ? "Under " + displayDistance(v[1], 0)
        : displayDistance(v[0], 0) +
          (v.length > 1 ? " - " + displayDistance(v[1], 0) : "")) +
        (v.length == 1 ? "+" : ""),
    ]),
  ),
};

const elevationDelimiters = [0, 300, 600, 900];
export const elevationValues = Object.fromEntries(
  elevationDelimiters.map((k, i) =>
    i + 1 < elevationDelimiters.length
      ? [k + "-" + elevationDelimiters[i + 1], [k, elevationDelimiters[i + 1]]]
      : [k + "+", [k]],
  ),
);
export const elevationOptions: { [key: string]: string } = {
  any: "Any ascent",
  ...Object.fromEntries(
    Object.entries(elevationValues).map(([k, v]) => [
      k,
      (v[0] == 0
        ? "Under " + displayElevation(v[1], true)
        : displayElevation(v[0], true) +
          (v.length > 1 ? " - " + displayElevation(v[1], true) : "")) +
        (v.length == 1 ? "+" : ""),
    ]),
  ),
};
