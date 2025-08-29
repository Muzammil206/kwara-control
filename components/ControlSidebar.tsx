"use client"

import { useState } from "react"
import type { ControlPointFeature, FilterType } from "../types/control"

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
      {/* ...existing sidebar JSX... */}
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
        {/* ...existing sidebar content... */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          {/* ...existing filter/search UI... */}
          {/* ...existing code... */}
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
                  {/* ...existing code for sidebar item... */}
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

export default ControlSidebar
