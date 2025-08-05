"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Activity, Settings, MapPin } from "lucide-react"

interface MapControlDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  control: {
    id: string
    name: string
    coordinates: string
    status: "Active" | "Maintenance" | "Offline"
    type: string
    lastUpdate: string
    properties: any
  } | null
}

export function MapControlDetailsModal({ isOpen, onClose, control }: MapControlDetailsModalProps) {
  if (!control) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6 rounded-xl shadow-2xl border-none bg-white text-stripe-text-dark">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold text-stripe-dark-blue flex items-center">
            <MapPin className="h-6 w-6 mr-2 text-blue-600" />
            {control.name}
          </DialogTitle>
          <DialogDescription className="text-stripe-text-light text-sm">ID: {control.id}</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Status:</span>
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
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Type:</span>
            <span className="text-stripe-text-light">{control.type}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Coordinates:</span>
            <span className="text-xs font-mono text-stripe-text-light">{control.coordinates}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Location:</span>
            <span className="text-stripe-text-light">{control.properties.location || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Height (m):</span>
            <span className="text-stripe-text-light">{control.properties.height_m ?? "N/A"}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Last Update:</span>
            <span className="text-xs text-stripe-text-light">{control.lastUpdate}</span>
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
