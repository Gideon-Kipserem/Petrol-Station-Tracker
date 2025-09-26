const BASE_URL = "https://petrol-station-tracker-7.onrender.com";
// get station by id
export async function getStationById(id) {
  const res = await fetch(`${BASE_URL}/stations/${id}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch station");
  return await res.json();
}
// get all stations
export async function getAllStations() {
  const res = await fetch(`${BASE_URL}/stations`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch Stations");
  return await res.json();
}

// Add station
export async function addStation(station) {
  const res = await fetch(`${BASE_URL}/stations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(station),
  });
  if (!res.ok) throw new Error("Failed to add station");
  return await res.json();
}

// Update Station
export async function updateStation(id, updates) {
  const res = await fetch(`${BASE_URL}/stations/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update station");
  return await res.json();
}

// Delete Station
export async function deleteStation(id) {
  const res = await fetch(`${BASE_URL}/stations/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete station");
  return true;
}

// API FUNCTIONS FOR Pumps
// Get
export async function getPumpsByStation(stationId) {
  const res = await fetch(`${BASE_URL}/stations/${stationId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch pumps");
  const station = await res.json();
  return station.pumps || [];
}
// add
export async function addPump(stationId, pump) {
  const res = await fetch(`${BASE_URL}/pumps`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pump_number: pump.pump_number,
      fuel_type: pump.fuel_type,
      station_id: stationId,
    }),
  });
  if (!res.ok) throw new Error("Failed to add pump");
  return await res.json();
}
// edit
export async function updatePump(id, updates) {
  const res = await fetch(`${BASE_URL}/pumps/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update pump");
  return await res.json();
}
// delete
export async function deletePump(id) {
  const res = await fetch(`${BASE_URL}/pumps/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete pump");
  return true;
}

// API FUNCTIONS FOR Staff

// Get all staff for a specific station
export async function getStaffByStation(stationId) {
  const res = await fetch(`${BASE_URL}/stations/${stationId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch staff");
  const station = await res.json();
  return station.staff || [];
}

// Add staff to a station
export async function addStaff(stationId, staff) {
  const res = await fetch(`${BASE_URL}/staff`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...staff, station_id: stationId }),
  });
  if (!res.ok) throw new Error("Failed to add staff");
  return await res.json();
}

// Update staff by ID
export async function updateStaff(id, updates) {
  const res = await fetch(`${BASE_URL}/staff/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update staff");
  return await res.json();
}

// Delete staff by ID
export async function deleteStaff(id) {
  const res = await fetch(`${BASE_URL}/staff/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete staff");
  return true;
}
