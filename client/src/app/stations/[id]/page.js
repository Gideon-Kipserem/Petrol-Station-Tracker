"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getStationById } from "../../Lib/api.js";
import PumpManager from "./PumpManager";
import StaffManager from "./StaffManager";

export default function StationDetail() {
  const params = useParams();
  const stationId = params.id;

  const [station, setStation] = useState(null);

  // Fetch station by ID
  useEffect(() => {
    async function fetchStation() {
      try {
        const data = await getStationById(stationId);
        setStation(data);
      } catch (error) {
        console.error("Failed to fetch station:", error);
      }
    }
    fetchStation();
  }, [stationId]);

  // Update station info
  const handleUpdateStation = async (updates) => {
    try {
      const updated = await updateStation(stationId, updates);
      setStation(updated);
    } catch (error) {
      console.error("Failed to update station:", error);
    }
  };

  // Delete station
  const handleDeleteStation = async () => {
    try {
      await deleteStation(stationId);
      alert("Station deleted!");
      // Optionally, navigate back to /stations
    } catch (error) {
      console.error("Failed to delete station:", error);
    }
  };

  if (!station) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{station.name}</h1>
      <p className="text-gray-600">{station.location}</p>

      {/* Edit/Delete Station */}
      <div className="mt-4 space-x-2">
        <button
          onClick={() => handleUpdateStation({ name: "Updated Name" })}
          className="bg-yellow-400 px-2 py-1 rounded"
        >
          Edit Station
        </button>
        <button
          onClick={handleDeleteStation}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          Delete Station
        </button>
      </div>

      {/* Pump Manager */}
      <div className="mt-6">
        <PumpManager stationId={stationId} pumps={station.pumps} />
      </div>

      {/* Staff Manager */}
      <div className="mt-6">
        <StaffManager stationId={stationId} staff={station.staff} />
      </div>
    </div>
  );
}
