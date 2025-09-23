"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllStations, addStation } from "@/app/Lib/api";

export default function StationsPage() {
  const [stations, setStations] = useState([]);
  const [newStationName, setNewStationName] = useState("");
  const [newStationLocation, setNewStationLocation] = useState("");

  useEffect(() => {
    async function fetchStations() {
      const data = await getAllStations();
      setStations(data);
    }
    fetchStations();
  }, []);

  const handleAddStation = async () => {
    if (!newStationName || !newStationLocation) return;
    try {
      const added = await addStation({
        name: newStationName,
        location: newStationLocation,
      });
      setStations([...stations, added]);
      setNewStationName("");
      setNewStationLocation("");
    } catch (error) {
      console.error("Failed to add station:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Stations</h1>

      {/* Create/add New Station */}
      <div className="mb-6 flex space-x-2">
        <input
          type="text"
          placeholder="Station Name"
          value={newStationName}
          onChange={(e) => setNewStationName(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={newStationLocation}
          onChange={(e) => setNewStationLocation(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={handleAddStation}
          className="bg-green-500 text-white px-4 py-1 rounded"
        >
          Add Station
        </button>
      </div>

      {/* Display Station List */}
      <ul className="space-y-4">
        {stations.map((station) => (
          <li key={station.id} className="border p-4 rounded">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">{station.name}</h2>
                <p className="text-gray-600">{station.location}</p>
                <p className="text-gray-500">
                  Pumps: {station.pumps ? station.pumps.length : 0}
                </p>
                <p className="text-gray-500">
                  Staff:{" "}
                  {station.staff && station.staff.length > 0
                    ? station.staff
                        .map((s) => `${s.name} (${s.role})`)
                        .join(", ")
                    : "No staff"}
                </p>
              </div>
              <Link
                href={`/stations/${station.id}`}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Open
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
