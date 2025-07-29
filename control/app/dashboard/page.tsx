"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, MapPin, Activity, Settings, User, LogOut, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet" 
import { Map } from "@/components/map"

const controlData = [
  {
    id: "KW001",
    name: "Ilorin Central Control",
    coordinates: "8.4799° N, 4.5418° E",
    status: "Active",
    type: "Primary Control",
    lastUpdate: "2 minutes ago",
  },
  {
    id: "KW002",
    name: "Offa District Control",
    coordinates: "8.1479° N, 4.7209° E",
    status: "Active",
    type: "Secondary Control",
    lastUpdate: "5 minutes ago",
  },
  {
    id: "KW003",
    name: "Omu-Aran Control Point",
    coordinates: "8.1333° N, 5.1000° E",
    status: "Maintenance",
    type: "Regional Control",
    lastUpdate: "1 hour ago",
  },
  {
    id: "KW004",
    name: "Lafiagi Control Station",
    coordinates: "8.8667° N, 5.4167° E",
    status: "Active",
    type: "Border Control",
    lastUpdate: "3 minutes ago",
  },
]

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedControl, setSelectedControl] = useState(controlData[0])

  const filteredControls = controlData.filter(
    (control) =>
      control.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      control.coordinates.includes(searchQuery) ||
      control.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const Sidebar = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Control Search</h2>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by coordinates, name, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-medium">Control Points</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredControls.map((control) => (
            <Card
              key={control.id}
              className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                selectedControl.id === control.id ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => setSelectedControl(control)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{control.name}</h4>
                  <Badge variant={control.status === "Active" ? "default" : "secondary"}>{control.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{control.id}</p>
                <p className="text-xs text-muted-foreground flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {control.coordinates}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-medium">Selected Control Details</h3>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{selectedControl.name}</CardTitle>
            <CardDescription>{selectedControl.id}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant={selectedControl.status === "Active" ? "default" : "secondary"}>
                {selectedControl.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Type:</span>
              <span className="text-sm">{selectedControl.type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Coordinates:</span>
              <span className="text-xs font-mono">{selectedControl.coordinates}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Update:</span>
              <span className="text-xs text-muted-foreground">{selectedControl.lastUpdate}</span>
            </div>
            <Separator />
            <div className="space-y-2">
              <Button size="sm" className="w-full">
                <Activity className="h-4 w-4 mr-2" />
                View Details
              </Button>
              <Button size="sm" variant="outline" className="w-full bg-transparent">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="flex h-16 items-center px-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <Sidebar />
            </SheetContent>
          </Sheet>

          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Kwara State Control Portal</h1>
          </div>

          <div className="ml-auto flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-80 border-r bg-muted/10 p-6 min-h-[calc(100vh-4rem)]">
          <Sidebar />
        </aside>

        {/* Main Content - Map Area */}
        <main className="flex-1 p-6">
          <Card className="h-[calc(100vh-8rem)]">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Control Points Map
              </CardTitle>
              <CardDescription>Interactive map showing all control points across Kwara State</CardDescription>
            </CardHeader>
            <CardContent className="h-full">
             
              <Map/>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
