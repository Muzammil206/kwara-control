"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Layers, Satellite, Zap, Wind } from "lucide-react"
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import { useEffect, useRef } from 'react';



export function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.5, 40],
      zoom: 9,
    });
    return () => map.remove();
  }, []);

  return (
    <Card className="border-2 border-gray-700 shadow-xl bg-gray-800/90 backdrop-blur-sm h-full p-0 m-0">
      <div ref={mapContainer} className="w-full h-full">
        {/* Map will be rendered here */}
      </div>
    </Card>
  )
}
