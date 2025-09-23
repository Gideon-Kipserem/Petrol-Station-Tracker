const BASE_URL = "http://127.0.0.1:5555";

export async function getStationById(id) {
  const res = await fetch(`${BASE_URL}/stations/${id}`, {cache: "no-store"});
  if (!res.ok) throw new Error("Failed to fetch station");
  return await res.json();
}

export async function getAllStations() {
    const res = await fetch(`${BASE_URL}/stations`, {
        cache: "no-store" });
    if (!res.ok) throw new Error ("Failed to fetch Stations");
    return await res.json();
}

// Add station
export async function addStation(station) {
    const res = await fetch(`${BASE_URL}/stations`, {
        method: "POST",
        headers: {"Content-Type":"application/json" },
        body: JSON.stringify(station),
    });
    if (!res.ok) throw new Error("Failed to add station");
    return await res.json();
}

// Update Station
export async function updateStation(id, updates) {
    const res = await fetch(`${BASE_URL}/stations/${id}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update station");
    return await res.json();
}

// Delete Station
export async function deleteStation(id) {
    const res = await fetch(`${BASE_URL}/stations/${id}`, {
        method:"DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete station");
    return true;
}

// API FUNCTIONS FOR Pumps
// Get
export async function getPumpsByStation(stationId) {
  const res = await fetch(`${BASE_URL}/stations/${stationId}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch pumps");
  const station = await res.json();
  return station.pumps || [];
}

export async function addPump(stationId, pump) {
  const res = await fetch(`${BASE_URL}/pumps`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...pump, station_id: stationId }),
  });
  if (!res.ok) throw new Error("Failed to add pump");
  return await res.json();
}

export async function updatePump(id, updates) {
  const res = await fetch(`${BASE_URL}/pumps/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update pump");
  return await res.json();
}

export async function deletePump(id) {
  const res = await fetch(`${BASE_URL}/pumps/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete pump");
  return true;
}