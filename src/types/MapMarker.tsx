type MapMarker = {
  coordinates: [number, number];
  properties: {
    type: string;
    slug: string;
    name: string;
    book?: number;
    height?: number;
  };
};

export default MapMarker;
