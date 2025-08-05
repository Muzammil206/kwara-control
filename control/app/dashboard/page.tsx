"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  MapPin,
  Activity,
  Settings,
  User,
  LogOut,
  Menu,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { Map } from "@/components/map" // Import the Map component
import { supabase } from "@/lib/supabaseClient" 
import { MapControlDetailsModal } from "@/components/map-control-details-modal" // Import the new modal component

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

  const filteredControls = controlPoints.filter(
    (control) =>
      control.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      control.coordinates.includes(searchQuery) ||
      control.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      control.properties.location?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const SidebarContent = () => (
    <div className="flex flex-col h-full p-6 bg-white text-stripe-text-dark border-r border-gray-100 shadow-lg rounded-stripe-xl">
      <div className="space-y-6 flex-grow">
        {/* Search Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-stripe-dark-blue tracking-tight">Control Search</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by station, location, or coordinates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm text-stripe-text-dark"
            />
          </div>
        </div>

        <Separator className="bg-gray-200 my-6" />

        {/* Control Points List */}
        <div className="space-y-4 flex-grow overflow-hidden">
          <h3 className="font-semibold text-lg text-stripe-text-dark flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-blue-600" />
            Control Points ({filteredControls.length})
          </h3>
          {loading ? (
            <div className="flex items-center justify-center h-32 text-stripe-text-light">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2">Loading data...</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">{error}</div>
          ) : filteredControls.length > 0 ? (
            <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2 custom-scrollbar">
              {filteredControls.map((control) => (
                <Card
                  key={control.id}
                  className={`cursor-pointer transition-all duration-300 ease-in-out rounded-lg shadow-sm hover:shadow-md hover:border-blue-400 ${
                    selectedControl?.id === control.id
                      ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50 shadow-lg"
                      : "bg-white border border-gray-200"
                  }`}
                  onClick={() => setSelectedControl(control)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-base text-stripe-text-dark">{control.name}</h4>
                      <Badge
                        className={`text-xs px-2 py-1 rounded-full ${
                          control.status === "Active"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : control.status === "Maintenance"
                              ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                              : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                      >
                        {control.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-stripe-text-light mb-1 flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-blue-500" />
                      {control.coordinates}
                    </p>
                    <p className="text-xs text-stripe-text-light">Location: {control.properties.location || "N/A"}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-stripe-text-light text-center py-4">No control points found.</p>
          )}
        </div>

        <Separator className="bg-gray-200 my-6" />

        {/* Selected Control Details */}
        {selectedControl && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-stripe-text-dark flex items-center">
              <Activity className="h-5 w-5 mr-2 text-purple-600" />
              Selected Control Details
            </h3>
            <Card className="bg-white border border-gray-200 shadow-lg rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-stripe-dark-blue font-bold">{selectedControl.name}</CardTitle>
                <CardDescription className="text-stripe-text-light text-sm">{selectedControl.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-stripe-text-dark">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Status:</span>
                  <Badge
                    className={`text-xs px-2 py-1 rounded-full ${
                      selectedControl.status === "Active"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : selectedControl.status === "Maintenance"
                          ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                  >
                    {selectedControl.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Type:</span>
                  <span className="text-stripe-text-light">{selectedControl.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Coordinates:</span>
                  <span className="text-xs font-mono text-stripe-text-light">{selectedControl.coordinates}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Location:</span>
                  <span className="text-stripe-text-light">{selectedControl.properties.location || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Height (m):</span>
                  <span className="text-stripe-text-light">{selectedControl.properties.height_m ?? "N/A"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Last Update:</span>
                  <span className="text-xs text-stripe-text-light">{selectedControl.lastUpdate}</span>
                </div>
                <Separator className="bg-gray-200" />
                <div className="space-y-2 pt-2">
                  <Button
                    size="sm"
                    className="w-full bg-stripe-dark-blue hover:bg-blue-800 text-white rounded-md shadow-sm transition-colors duration-200"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    View Live Data
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-gray-300 text-stripe-text-dark hover:bg-gray-50 bg-transparent rounded-md shadow-sm transition-colors duration-200"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Control
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )

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
              <SidebarContent />
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
          <SidebarContent />
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
