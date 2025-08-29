import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const parcelId = searchParams.get("id");

  let query = supabase
    .rpc("get_kwara_state_geojson");

  if (parcelId) {
    query = query.eq("id", parcelId);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error }, { status: 500 });

  // Handle null or empty data
  const features = Array.isArray(data) ? data.map((row) => ({
    type: "Feature",
    geometry: row.geom,
    properties: {
      id: row.id,
      station: row.station,
      location: row.location,
      order: row.order,
      easting_m: row.easting_m,
      northing_m: row.northing_m,
      height_m: row.height_m,
    },
  })) : [];

  const geojson = {
    type: "FeatureCollection",
    features,
  };

  return NextResponse.json({
    
     data
  });
}
