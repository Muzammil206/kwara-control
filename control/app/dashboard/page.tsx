"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, User, LogOut, Menu, ChevronRight, ChevronLeft, Loader2 } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { Map } from "@/components/map" // Import the Map component
import { supabase } from "@/lib/supabaseClient" // Import your Supabase client
import { MapControlDetailsModal } from "@/components/map-control-details-modal" // Import the new modal component
import { SidebarContent } from "@/components/sidebar-content" // Import the new SidebarContent component

interface GeoJsonFeature {
  type: "Feature"
  geometry: {
    coordinates: [number, number]
    type: "Point"
  }
  properties: {
    easting_m: number
    h_of_inst: number | null
    height_m: number
    location: string
    northing_m: number
    order: string
    station: string
    [key: string]: any // Allow for other properties
  }
}

interface GeoJsonData {
  type: "FeatureCollection"
  features: GeoJsonFeature[]
}

interface ControlPoint {
  id: string
  name: string
  coordinates: string
  status: "Active" | "Maintenance" | "Offline" // Assuming these statuses
  type: string
  lastUpdate: string
  properties: any // To store original GeoJSON properties
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [controlPoints, setControlPoints] = useState<ControlPoint[]>([])
  const [selectedControl, setSelectedControl] = useState<ControlPoint | null>(null)
  const [geojson, setGeojson] = useState<GeoJsonData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalControlData, setModalControlData] = useState<ControlPoint | null>(null)

  useEffect(() => {
    const fetchControlPoints = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data, error } = await supabase.rpc("get_kwara_state_geojson")

        if (error) {
          throw error
        }

        if (data) {
          const newGeojson: GeoJsonData = data as GeoJsonData
          setGeojson(newGeojson)

          const transformedData: ControlPoint[] = newGeojson.features.map((feature, index) => {
            const [lng, lat] = feature.geometry.coordinates
            const stationName = feature.properties.station || `Control Point ${index + 1}`
            const location = feature.properties.location || "Unknown Location"
            const order = feature.properties.order || "N/A"

            const statusOptions: ("Active" | "Maintenance" | "Offline")[] = ["Active", "Maintenance", "Offline"]
            const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)]
            const randomMinutesAgo = Math.floor(Math.random() * 60) + 1
            const lastUpdateText = `${randomMinutesAgo} minutes ago`

            return {
              id: feature.properties.station || `CP-${index + 1}`,
              name: stationName,
              coordinates: `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`,
              status: randomStatus,
              type: order,
              lastUpdate: lastUpdateText,
              properties: feature.properties, // Keep original properties
            }
          })
          setControlPoints(transformedData)
          if (transformedData.length > 0) {
            setSelectedControl(transformedData[0])
          }
        }
      } catch (err: any) {
        console.error("Error fetching control points:", err.message)
        setError("Failed to load control points. Please check your Supabase connection and RPC function.")
      } finally {
        setLoading(false)
      }
    }

    fetchControlPoints()
  }, [])

  const handleMapPointClick = (feature: any) => {
    const [lng, lat] = feature.geometry.coordinates
    const clickedControl: ControlPoint = {
      id: feature.properties.station || `CP-${Date.now()}`, // Fallback ID
      name: feature.properties.station || "Control Point",
      coordinates: `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`,
      status: "Active", // Default status, you might want to derive this from properties
      type: feature.properties.order || "N/A",
      lastUpdate: "Just now", // Default update, you might want to derive this
      properties: feature.properties,
    }
    setModalControlData(clickedControl)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-stripe-light-gray flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 z-20 shadow-sm">
        <div className="flex h-16 items-center px-4">
          {/* Mobile Sidebar Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-gray-600 hover:text-gray-900">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <SidebarContent
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                controlPoints={controlPoints}
                selectedControl={selectedControl}
                setSelectedControl={setSelectedControl}
                loading={loading}
                error={error}
              />
            </SheetContent>
          </Sheet>

          <div className="flex items-center space-x-4 ml-4 md:ml-0">
            <h1 className="text-2xl font-bold text-stripe-dark-blue">Kwara State Control Portal</h1>
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area with Resizable Panels */}
      <ResizablePanelGroup direction="horizontal" className="flex-grow">
        {/* Desktop Sidebar Panel */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={35} className="hidden md:flex flex-col p-6">
          <SidebarContent
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            controlPoints={controlPoints}
            selectedControl={selectedControl}
            setSelectedControl={setSelectedControl}
            loading={loading}
            error={error}
          />
        </ResizablePanel>

        <ResizableHandle withHandle className="hidden md:flex">
          <div className="w-4 h-full flex items-center justify-center bg-gray-200 hover:bg-blue-200 transition-colors duration-200">
            <ChevronLeft className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
            <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
          </div>
        </ResizableHandle>

        {/* Map Panel */}
        <ResizablePanel defaultSize={75} minSize={50}>
          <div className="h-full w-full p-6 bg-stripe-light-gray">
            <Card className="h-full w-full rounded-lg overflow-hidden shadow-xl border-none bg-white">
              <CardHeader className="pb-3 bg-white text-stripe-dark-blue rounded-t-lg border-b border-gray-100">
                <CardTitle className="flex items-center text-stripe-dark-blue">
                  <MapPin className="h-6 w-6 mr-2 text-blue-600" />
                  Control Points Map
                </CardTitle>
                <CardDescription className="text-stripe-text-light">
                  Interactive map showing all control points across Kwara State
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[calc(100%-6rem)] p-0">
                {loading ? (
                  <div className="flex items-center justify-center h-full bg-white">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                    <span className="ml-4 text-lg text-stripe-text-light">Loading map data...</span>
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-full bg-white text-red-500 text-center p-4">
                    {error}
                  </div>
                ) : geojson ? (
                  <Map geojson={geojson} onPointClick={handleMapPointClick} />
                ) : (
                  <div className="flex items-center justify-center h-full bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-center space-y-2">
                      <MapPin className="h-12 w-12 mx-auto text-gray-400" />
                      <p className="text-lg font-medium text-stripe-text-light">No map data available.</p>
                      <p className="text-sm text-stripe-text-light">
                        Please ensure your Supabase RPC function returns control point data.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      {modalControlData && (
        <MapControlDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} control={modalControlData} />
      )}
    </div>
  )
}
