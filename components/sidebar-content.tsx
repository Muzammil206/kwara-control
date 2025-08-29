"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, MapPin, Activity, Settings, Loader2 } from "lucide-react"

interface ControlPoint {
  id: string
  name: string
  coordinates: string
  status: "Active" | "Maintenance" | "Offline"
  type: string
  lastUpdate: string
  properties: any
}

interface SidebarContentProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  controlPoints: ControlPoint[]
  selectedControl: ControlPoint | null
  setSelectedControl: (control: ControlPoint | null) => void
  loading: boolean
  error: string | null
}

export function SidebarContent({
  searchQuery,
  setSearchQuery,
  controlPoints,
  selectedControl,
  setSelectedControl,
  loading,
  error,
}: SidebarContentProps) {
  const filteredControls = controlPoints.filter(
    (control) =>
      control.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      control.coordinates.includes(searchQuery) ||
      control.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      control.properties.location?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col h-full p-6 bg-gradient-to-br from-sidebar-dark-blue-start to-sidebar-dark-blue-end text-sidebar-text-light border-r border-sidebar-border-subtle shadow-2xl rounded-stripe-xl">
      <div className="space-y-6 flex-grow">
        {/* Search Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">Control Search</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by station, location, or coordinates..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                console.log("Search query updated:", e.target.value) // Debugging search input
              }}
              className="pl-10 pr-4 py-2 rounded-lg border border-sidebar-border-subtle bg-sidebar-card-bg text-sidebar-text-light placeholder:text-gray-400 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm"
            />
          </div>
        </div>

        <Separator className="bg-sidebar-border-subtle my-6" />

        {/* Control Points List */}
        <div className="space-y-4 flex-grow overflow-hidden">
          <h3 className="font-semibold text-lg text-white flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-blue-400" />
            Control Points ({filteredControls.length})
          </h3>
          {loading ? (
            <div className="flex items-center justify-center h-32 text-gray-300">
              <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
              <span className="ml-2">Loading data...</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-400 py-4">{error}</div>
          ) : filteredControls.length > 0 ? (
            <>
              {console.log("Filtered controls count:", filteredControls.length)} {/* Debugging filtered count */}
              <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-2 custom-scrollbar">
                {filteredControls.map((control) => (
                  <Card
                    key={control.id}
                    className={`cursor-pointer transition-all duration-300 ease-in-out rounded-lg shadow-sm hover:shadow-md hover:border-blue-400 ${
                      selectedControl?.id === control.id
                        ? "ring-2 ring-blue-500 border-blue-500 bg-sidebar-card-bg shadow-lg"
                        : "bg-sidebar-card-bg border border-sidebar-border-subtle"
                    }`}
                    onClick={() => setSelectedControl(control)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-base text-sidebar-text-light">{control.name}</h4>
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
                      <p className="text-xs text-blue-600 mb-1 flex items-center">
                        <MapPin className="h-3 w-3 mr-1 text-blue-400" />
                        {control.coordinates}
                      </p>
                      <p className="text-xs text-black-300">Location: {control.properties.location || "N/A"}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-300 text-center py-4">No control points found.</p>
          )}
        </div>

        <Separator className="bg-sidebar-border-subtle my-6" />

        {/* Selected Control Details */}
        {selectedControl && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-white flex items-center">
              <Activity className="h-5 w-5 mr-2 text-purple-400" />
              Selected Control Details
            </h3>
            <Card className="bg-sidebar-card-bg border border-sidebar-border-subtle shadow-lg rounded-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-white font-bold">{selectedControl.name}</CardTitle>
                <CardDescription className="text-gray-300 text-sm">{selectedControl.id}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-300">
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
                  <span className="text-gray-300">{selectedControl.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Coordinates:</span>
                  <span className="text-xs font-mono text-gray-300">{selectedControl.coordinates}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Location:</span>
                  <span className="text-gray-300">{selectedControl.properties.location || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Height (m):</span>
                  <span className="text-gray-300">{selectedControl.properties.height_m ?? "N/A"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Last Update:</span>
                  <span className="text-xs text-gray-300">{selectedControl.lastUpdate}</span>
                </div>
                <Separator className="bg-sidebar-border-subtle" />
                <div className="space-y-2 pt-2">
                  <Button
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition-colors duration-200"
                  >
                    <Activity className="h-4 w-4 mr-2" />
                    View Live Data
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-blue-700 text-white hover:bg-blue-800 bg-transparent rounded-md shadow-sm transition-colors duration-200"
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
}
