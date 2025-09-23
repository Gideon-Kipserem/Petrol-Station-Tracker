const BASE_URL = "http://127.0.0.1:5555/stations";

export async function getStationById(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {cache: "no-store"});
  if (!res.ok) throw new Error("Failed to fetch station");
  return await res.json();
}

export async function getAllStations() {
    const res = await fetch(BASE_URL, {
        cache: "no-store" });
    if (!res.ok) throw new Error ("Failed to fetch Stations");
    return await res.json();
}

// Add station
export async function addStation(station) {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {"Content-Type":"application/json" },
        body: JSON.stringify(station),
    });
    if (!res.ok) throw new Error("Failed to add station");
    return await res.json();
}

// Update Station
export async function updateStation(id, updates) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error("Failed to update station");
    return await res.json();
}

// Delete Station
export async function deleteStation(id) {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method:"DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete station");
    return true;
}