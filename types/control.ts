// Types for GeoJSON and filters used by dashboard and sidebar
export type ControlPointProperties = {
  id: number
  station: string
  location: string
  order: string
  easting_m: number
  northing_m: number
  height_m: number
}

export type ControlPointFeature = {
  type: "Feature"
  geometry: {
    type: "Point"
    coordinates: [number, number, number]
    crs?: any
  }
  properties: ControlPointProperties
}

export type ControlPointFeatureCollection = {
  type: "FeatureCollection"
  features: ControlPointFeature[]
}


export type CorsPolygonFeature = {
  type: "Feature"
  geometry: {
    type: "Polygon"
    coordinates: number[][][];
    crs?: any;
  };
  properties: {
    id: number;
    station: string;
    location: string;
    order: string;
    easting_m: number;
    northing_m: number;
    height_m: number;
  };
};


export type CorsPolygonFeatureCollection = {
  type: "FeatureCollection";
  features: CorsPolygonFeature[];
};



export type FilterType = "all" | "order" | "location" | "height" | "coordinates"
