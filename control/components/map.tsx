"use client"

import { Card } from "@/components/ui/card"
import "mapbox-gl/dist/mapbox-gl.css"
import mapboxgl from "mapbox-gl"
import { useEffect, useRef } from "react"

interface MapProps {
  geojson: any
  onPointClick: (feature: any) => void // Callback for when a point is clicked
}

export function Map({ geojson, onPointClick }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY
    if (!accessToken) {
      console.error(
        "Mapbox access token is not set. Please set NEXT_PUBLIC_MAPBOX_API_KEY in your environment variables.",
      )
      return
    }

    mapboxgl.accessToken = accessToken

    // Initialize the map only once
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12", // You can change this style, e.g., 'mapbox://styles/mapbox/light-v11'
        center: [4.55, 8.5], // Center over Kwara State
        zoom: 8,
      })
    }

    const map = mapRef.current

    // Ensure map is loaded before adding sources/layers
    map.on("load", () => {
      // Remove existing source/layer if reloaded
      if (map.getSource("controls")) {
        if (map.getLayer("control-points")) {
          map.removeLayer("control-points")
        }
        map.removeSource("controls")
      }

      if (
        geojson &&
        geojson.type === "FeatureCollection" &&
        Array.isArray(geojson.features) &&
        geojson.features.length > 0 // Check if features array is not empty
      ) {
        map.addSource("controls", {
          type: "geojson",
          data: geojson,
        })

        map.addLayer({
          id: "control-points",
          type: "circle",
          source: "controls",
          paint: {
            "circle-radius": 8, // Slightly larger for better visibility
            "circle-color": "#6366F1", // A modern blue/purple from Stripe palette
            "circle-stroke-width": 2,
            "circle-stroke-color": "#fff",
            "circle-opacity": 0.8,
          },
        })

        // Handle click event to open custom modal
        map.on("click", "control-points", (e) => {
          const features = map.queryRenderedFeatures(e.point, {
            layers: ["control-points"],
          })
          if (!features.length) return

          const feature = features[0]
          onPointClick(feature) // Pass the clicked feature to the parent
        })

        // Zoom to data bounds
        const bounds = new mapboxgl.LngLatBounds()
        geojson.features.forEach((feature: any) => {
          if (feature.geometry?.type === "Point") {
            const [lng, lat] = feature.geometry.coordinates
            bounds.extend([lng, lat])
          }
        })
        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, { padding: 80, maxZoom: 14, duration: 1000 }) // Increased padding and added duration
        }

        // Cursor effects
        map.on("mouseenter", "control-points", () => {
          map.getCanvas().style.cursor = "pointer"
        })
        map.on("mouseleave", "control-points", () => {
          map.getCanvas().style.cursor = ""
        })
      } else {
        console.warn("Invalid, empty, or missing geojson data for map. Map will not display points.")
      }
    })

    // Cleanup map on component unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [geojson, onPointClick]) // Re-run effect if geojson or onPointClick changes

  return (
    <Card className="h-full w-full rounded-lg overflow-hidden shadow-xl border-none">
      <div ref={mapContainer} className="w-full h-full" />
    </Card>
  )
}
