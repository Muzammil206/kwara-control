"use client"

import { useEffect, useState, useRef } from "react"

// --- Type Definitions ---
export type ControlPointProperties = {
  id: number;
  station: string;
  location: string;
  order: string;
  easting_m: number;
  northing_m: number;
  height_m: number;
  crs: any;
};

export type ControlPointFeature = {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number, number];
    crs?: any;
  };
  properties: ControlPointProperties;
};

export type ControlPointFeatureCollection = {
  type: "FeatureCollection";
  features: ControlPointFeature[];
};

export type FilterType = "all" | "order" | "location" | "height" | "coordinates";

// For CORS polygons
export type CorsPolygonFeature = {
  type: "Feature";
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
    crs?: any;
  };
  properties: {
    station: string;
    [key: string]: any;
  };
};

export type CorsPolygonFeatureCollection = {
  type: "FeatureCollection";
  features: CorsPolygonFeature[];
};
import { MapContainer, TileLayer, GeoJSON, useMap, LayersControl } from "react-leaflet"
import L, { type Map as LeafletMap, type Layer } from "leaflet"
import "leaflet/dist/leaflet.css"

// Modal for control point details
interface ControlPointModalProps {
  isOpen: boolean
  onClose: () => void
  properties?: ControlPointProperties
}
const ControlPointModal = ({ isOpen, onClose, properties }: ControlPointModalProps) => {
  if (!isOpen || !properties) return null
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Control Point Detail</h2>
          <button onClick={onClose} className="hover:bg-blue-700/20 p-1 rounded-full">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Station:</span>
            <span>{properties.station}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Location:</span>
            <span>{properties.location}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Order:</span>
            <span>{properties.order}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Easting (m):</span>
            <span>{properties.easting_m}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Northing (m):</span>
            <span>{properties.northing_m}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-medium">Height :</span>
            <span>{properties.height_m}</span>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

interface ControlSidebarProps {
  features: ControlPointFeature[]
  onSelect: (feature: ControlPointFeature) => void
  selected: ControlPointFeature | null
}

const ControlSidebar = ({ features, onSelect, selected }: ControlSidebarProps) => {
  const [search, setSearch] = useState("")
  const [filterType, setFilterType] = useState<FilterType>("all")
  const [orderFilter, setOrderFilter] = useState<string>("all")
  const [locationFilter, setLocationFilter] = useState<string>("all")
  const [heightRange, setHeightRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 })
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false)

  // Get unique values for filters
  const uniqueOrders = Array.from(new Set(features.map((f) => f.properties.order))).filter(Boolean)
  const uniqueLocations = Array.from(new Set(features.map((f) => f.properties.location))).filter(Boolean)
  const heightValues = features.map((f) => f.properties.height_m).filter((h) => typeof h === "number")
  const minHeight = Math.min(...heightValues)
  const maxHeight = Math.max(...heightValues)

  // Enhanced filtering logic
  const filtered = features.filter((f) => {
    const s = search.toLowerCase()
    const matchesSearch =
      !search ||
      f.properties.station?.toLowerCase().includes(s) ||
      f.properties.order?.toLowerCase().includes(s) ||
      f.properties.easting_m?.toString().includes(s) ||
      f.properties.northing_m?.toString().includes(s) ||
      f.properties.location?.toLowerCase().includes(s) ||
      String(f.properties.id).includes(s)

    const matchesOrder = orderFilter === "all" || f.properties.order === orderFilter
    const matchesLocation = locationFilter === "all" || f.properties.location === locationFilter
    const matchesHeight = f.properties.height_m >= heightRange.min && f.properties.height_m <= heightRange.max

    return matchesSearch && matchesOrder && matchesLocation && matchesHeight
  })

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-[1001] bg-white rounded-lg shadow-lg p-3 border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div
        className={`
        fixed lg:relative inset-y-0 left-0 z-[1000] lg:z-auto
        w-80 sm:w-96 lg:w-80 xl:w-96
        bg-white border-r border-gray-200 
        flex flex-col h-full
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        shadow-xl lg:shadow-none
      `}
      >
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Control Points</h2>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-2 hover:bg-white/50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search stations, locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
            />
          </div>

          <div className="mb-4">
            <button
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className="w-full flex items-center justify-between p-3 bg-white/60 rounded-xl border border-gray-200 hover:bg-white/80 transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span className="font-medium text-gray-700">Filters</span>
              </div>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isFiltersExpanded ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${isFiltersExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
            >
              <div className="pt-4 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Filter By:</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as FilterType)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/80 backdrop-blur-sm transition-all duration-200"
                  >
                    <option value="all">🔍 All Filters</option>
                    <option value="order">📊 Order</option>
                    <option value="location">📍 Location</option>
                    <option value="height">📏 Height Range</option>
                    <option value="coordinates">🗺️ Coordinates</option>
                  </select>
                </div>

                {(filterType === "all" || filterType === "order") && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Order:</label>
                    <select
                      value={orderFilter}
                      onChange={(e) => setOrderFilter(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/80 backdrop-blur-sm transition-all duration-200"
                    >
                      <option value="all">All Orders</option>
                      {uniqueOrders.map((order) => (
                        <option key={order} value={order}>
                          {order}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {(filterType === "all" || filterType === "location") && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location:</label>
                    <select
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white/80 backdrop-blur-sm transition-all duration-200"
                    >
                      <option value="all">All Locations</option>
                      {uniqueLocations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {(filterType === "all" || filterType === "height") && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Height Range: {heightRange.min}m - {heightRange.max}m
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-8">Min</span>
                        <input
                          type="range"
                          min={minHeight}
                          max={maxHeight}
                          value={heightRange.min}
                          onChange={(e) => setHeightRange((prev) => ({ ...prev, min: Number(e.target.value) }))}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-8">Max</span>
                        <input
                          type="range"
                          min={minHeight}
                          max={maxHeight}
                          value={heightRange.max}
                          onChange={(e) => setHeightRange((prev) => ({ ...prev, max: Number(e.target.value) }))}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-blue-600">{filtered.length}</span> of {features.length}
            </div>
            <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
              {Math.round((filtered.length / features.length) * 100)}%
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50/50">
          <div className="p-3 sm:p-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">No control points match your filters</p>
              </div>
            ) : (
              filtered.map((f, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onSelect(f)
                    setIsMobileOpen(false) // Close mobile sidebar on selection
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
                    selected?.properties?.id === f.properties?.id
                      ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-gray-900 text-sm">{f.properties.station}</div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        selected?.properties?.id === f.properties?.id
                          ? "bg-blue-200 text-blue-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      #{f.properties.id}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {f.properties.location}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      Order: {f.properties.order}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mt-2">
                      <div>E: {f.properties.easting_m}m</div>
                      <div>N: {f.properties.northing_m}m</div>
                      
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 11l5-5m0 0l5 5m-5-5v12"
                        />
                      </svg>
                      Height: {f.properties.height_m}m
                      <div>CRS: {f.properties.crs} </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}

const ControlPointsMap = () => {
  // Button to zoom to current location
  const ZoomToCurrentLocationButton = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handleZoom = () => {
      setError(null);
      setLoading(true);
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser.");
        setLoading(false);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoading(false);
          const { latitude, longitude } = position.coords;
          const map = mapRef.current;
          if (map) {
            map.flyTo([latitude, longitude], 15, {
              duration: 1.5,
              easeLinearity: 0.25,
            });
          }
        },
        (err) => {
          setLoading(false);
          setError("Unable to retrieve your location.");
        }
      );
    };
    return (
      <div className="absolute bottom-6 right-4 z-[1200] flex flex-col items-end gap-2">
        <button
          onClick={handleZoom}
          className="bg-white shadow-lg rounded-full p-3 border border-gray-200 hover:bg-blue-50 transition-colors flex items-center justify-center"
          title="Zoom to my location"
          aria-label="Zoom to my location"
          disabled={loading}
        >
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <circle cx="12" cy="12" r="4" strokeWidth="2" />
            <line x1="12" y1="2" x2="12" y2="6" strokeWidth="2" />
            <line x1="12" y1="18" x2="12" y2="22" strokeWidth="2" />
            <line x1="2" y1="12" x2="6" y2="12" strokeWidth="2" />
            <line x1="18" y1="12" x2="22" y2="12" strokeWidth="2" />
          </svg>
        </button>
        {error && (
          <div className="bg-red-100 text-red-700 text-xs rounded px-2 py-1 shadow mt-1 max-w-[180px]">{error}</div>
        )}
      </div>
    );
  };
  const [geoJsonData, setGeoJsonData] = useState<ControlPointFeatureCollection | null>(null)
  const [features, setFeatures] = useState<ControlPointFeature[]>([])
  const [selected, setSelected] = useState<ControlPointFeature | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mapInstance, setMapInstance] = useState<LeafletMap | null>(null)
  const [polygonData, setPolygonData] = useState<CorsPolygonFeatureCollection | null>(null)
  const [polygonVisibility, setPolygonVisibility] = useState<{ [station: string]: boolean }>({
    "NIS KWARA - CORS": true,
    "KW-GIS - CORS": true,
  });
  const mapRef = useRef<LeafletMap | null>(null)
  useEffect(() => {
    mapRef.current = mapInstance
  }, [mapInstance])

  // Polygon color by station
  const polygonColorMap: Record<string, string> = {
    "NIS KWARA - CORS": "#f59e42", // orange
    "KW-GIS - CORS": "#6366f1", // indigo
  };

  // Fetch polygons (CORS)
  useEffect(() => {
    const fetchDatacors = async () => {
      try {
        const response = await fetch("/api/getCors");
        const apiResponse = await response.json();
        const geojson: CorsPolygonFeatureCollection | undefined = apiResponse?.data;
        setPolygonData(geojson || null);
      } catch (error) {
        console.error("Error fetching GeoJSON data:", error);
      }
    };
    fetchDatacors();
  }, []);

  // Filter polygons by visibility
  const filteredPolygonData = polygonData
    ? {
        ...polygonData,
        features: polygonData.features.filter(
          (f) => polygonVisibility[f.properties.station]
        ),
      }
    : null;

  // Style polygons by station
  const polygonStyle = (feature: any) => {
    const station = feature.properties?.station || "";
    return {
      color: polygonColorMap[station] || "#6366f1",
      weight: 2,
      fillOpacity: 0.2,
    };
  };

  // Checkbox UI for toggling polygons with Select All/Deselect All
  const PolygonToggle = () => {
    const allOn = Object.values(polygonVisibility).every(Boolean);
    const allOff = Object.values(polygonVisibility).every((v) => !v);
    const handleAll = (value: boolean) => {
      setPolygonVisibility(
        Object.keys(polygonColorMap).reduce((acc, station) => {
          acc[station] = value;
          return acc;
        }, {} as { [station: string]: boolean })
      );
    };
    return (
      <div className="absolute top-20 right-10 bg-white rounded-lg shadow p-3 z-[1100] flex flex-col gap-2 min-w-[180px]">
        <div className="font-semibold text-xs text-gray-700 mb-1">CORS Coverage</div>
        <div className="flex gap-2 mb-2">
          <button
            className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200"
            onClick={() => handleAll(true)}
            disabled={allOn}
            type="button"
          >
            Select All
          </button>
          <button
            className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
            onClick={() => handleAll(false)}
            disabled={allOff}
            type="button"
          >
            Deselect All
          </button>
        </div>
        {Object.keys(polygonColorMap).map((station) => (
          <label key={station} className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={polygonVisibility[station]}
              onChange={() =>
                setPolygonVisibility((prev) => ({
                  ...prev,
                  [station]: !prev[station],
                }))
              }
            />
            <span
              style={{
                display: "inline-block",
                width: 12,
                height: 12,
                background: polygonColorMap[station],
                borderRadius: 3,
                marginRight: 4,
              }}
            />
            {station}
          </label>
        ))}
      </div>
    );
  };

  // --- Existing ControlPointsMap logic ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/getGeojson")
        const apiResponse = await response.json()
        const geojson: ControlPointFeatureCollection | undefined = apiResponse?.data
        setGeoJsonData(geojson || null)
        setFeatures(geojson?.features || [])
      } catch (error) {
        console.error("Error fetching GeoJSON data:", error)
      }
    }
    fetchData()
  }, [])

  const handleSelect = (feature: ControlPointFeature) => {
    setSelected(feature)
    const map = mapRef.current
    if (feature.geometry && map) {
      const coords = feature.geometry.coordinates
      if (Array.isArray(coords) && coords.length >= 2) {
        map.flyTo([coords[1], coords[0]], 16, {
          duration: 1.5,
          easeLinearity: 0.25,
        })
        // Open modal after animation completes
      
      }
    }
  }

  const onEachFeature = (feature: any, layer: Layer) => {
    layer.on("click", () => {
      setSelected(feature as ControlPointFeature)
      const map = mapRef.current
      if (feature.geometry && map) {
        const coords = feature.geometry.coordinates
        if (Array.isArray(coords) && coords.length >= 2) {
          map.flyTo([coords[1], coords[0]], 16, {
            duration: 1.5,
            easeLinearity: 0.25,
          })
          // Open modal after animation completes
          setTimeout(() => {
            setIsModalOpen(true)
          }, 1600)
        }
      }
    })
  }

  // Color points by 'order' property
  const orderColorMap: Record<string, string> = {
    "First Order": "#eab308", // yellow
    "Second Order": "#3b82f6", // blue
    "Third Order": "#10b981", // green
    "Fourth Order": "#ef4444", // red
  }

  const geoJsonStyle = (feature: any) => {
    const order = feature.properties?.order || ""
    const color = orderColorMap[order] || "#6366f1"
    const isSelected = selected?.properties?.id === feature.properties?.id

    return {
      radius: isSelected ? 8 : 6,
      fillColor: color,
      color: isSelected ? "#000" : color,
      weight: isSelected ? 3 : 2,
      opacity: 1,
      fillOpacity: isSelected ? 1 : 0.8,
    }
  }

  // MapController component
  const MapController = ({ selectedFeature, allFeatures, onMapReady }: {
    selectedFeature: ControlPointFeature | null;
    allFeatures: ControlPointFeature[];
    onMapReady?: (map: LeafletMap) => void;
  }) => {
    const leafletMap = useMap();
    useEffect(() => {
      if (onMapReady) {
        onMapReady(leafletMap);
      }
    }, [leafletMap, onMapReady]);
    useEffect(() => {
      if (allFeatures.length && leafletMap) {
        const geoJsonLayer = L.geoJSON({
          type: "FeatureCollection",
          features: allFeatures,
        } as any);
        const bounds = geoJsonLayer.getBounds();
        if (bounds.isValid()) {
          leafletMap.fitBounds(bounds, { padding: [20, 20] });
        }
      }
    }, [allFeatures, leafletMap]);
    useEffect(() => {
      if (selectedFeature && selectedFeature.geometry && leafletMap) {
        const geoJsonLayer = L.geoJSON(selectedFeature as any);
        const bounds = geoJsonLayer.getBounds();
        if (bounds.isValid()) {
          leafletMap.fitBounds(bounds, { padding: [20, 20] });
        }
      }
    }, [selectedFeature, leafletMap]);
    return null;
  };

  // Legend component
  const Legend = ({ orderColorMap, features }: { orderColorMap: Record<string, string>, features: ControlPointFeature[] }) => {
    const uniqueOrders = Array.from(new Set(features.map((f) => f.properties.order))).filter(Boolean);
    return (
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 z-[1000] max-w-xs">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm">Legend - Control Point Orders</h3>
        <div className="space-y-2">
          {uniqueOrders.map((order) => (
            <div key={order} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border-2"
                style={{
                  backgroundColor: orderColorMap[order] || "#6366f1",
                  borderColor: orderColorMap[order] || "#6366f1",
                }}
              />
              <span className="text-sm text-gray-700">{order}</span>
              <span className="text-xs text-gray-500">
                ({features.filter((f) => f.properties.order === order).length})
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-2 border-t border-gray-200">
          <div className="text-xs text-gray-500">Total Points: {features.length}</div>
        </div>
      </div>
    );
  };

  const { BaseLayer } = LayersControl;

  return (
    <div className="flex h-screen bg-gray-50">
      <ControlSidebar features={features} onSelect={handleSelect} selected={selected} />
      <div className="flex-1 relative">
        <PolygonToggle />
        <ZoomToCurrentLocationButton />
        <MapContainer center={[8.5, 9.0]} zoom={8} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LayersControl position="topright">
            <BaseLayer checked name="OpenStreetMap">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            </BaseLayer>
            <BaseLayer name="Esri Satellite">
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            </BaseLayer>
            <BaseLayer name="Carto Light">
              <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            </BaseLayer>
            <BaseLayer name="Carto Dark">
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            </BaseLayer>
          </LayersControl>
          <MapController selectedFeature={selected} allFeatures={features} onMapReady={setMapInstance} />
          {geoJsonData && (
            <GeoJSON
              key={JSON.stringify(geoJsonData) + selected?.properties?.id}
              data={geoJsonData as any}
              pointToLayer={(feature, latlng) => L.circleMarker(latlng, geoJsonStyle(feature))}
              onEachFeature={onEachFeature}
            />
          )}
          {filteredPolygonData && (
            <GeoJSON
              key={JSON.stringify(filteredPolygonData)}
              data={filteredPolygonData as any}
              style={polygonStyle}
            />
          )}
        </MapContainer>
        <Legend orderColorMap={orderColorMap} features={features} />
      </div>
      <ControlPointModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} properties={selected?.properties} />
    </div>
  )
}

export default ControlPointsMap
