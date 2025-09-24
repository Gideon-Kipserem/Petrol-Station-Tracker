"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getStationById, updateStation, deleteStation } from "@/app/Lib/api";
import PumpManager from "./PumpManager";
import StaffManager from "./StaffManager";

export default function StationDetail() {
  const params = useParams();
  const router = useRouter();
  const stationId = params.id;

  const [station, setStation] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", location: "" });

  // Fetch station by ID
  useEffect(() => {
    async function fetchStation() {
      try {
        const data = await getStationById(stationId);
        setStation(data);
        setEditData({ name: data.name, location: data.location }); // preload form
      } catch (error) {
        console.error("Failed to fetch station:", error);
      }
    }
    fetchStation();
  }, [stationId]);

  // Update station info
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateStation(stationId, editData);
      setStation(updated);
      setEditing(false);
    } catch (error) {
      console.error("Failed to update station:", error);
    }
  };

  // Delete station
  const handleDeleteStation = async () => {
    try {
      await deleteStation(stationId);
      alert("Station deleted!");
      router.push("/stations"); // redirect to stations list
    } catch (error) {
      console.error("Failed to delete station:", error);
    }
  };

  if (!station) return <p>Loading...</p>;

  return (
    <div className="p-6">
      {/* Back button */}
      <button
        onClick={() => router.push("/stations")}
        className="bg-gray-300 px-3 py-1 rounded mb-4"
      >
        ← Back to Stations
      </button>

      <h1 className="text-3xl font-bold">{station.name}</h1>
      <p className="text-gray-600">{station.location}</p>

      {/* Edit/Delete Station */}
      <div className="mt-4 space-x-2">
        {editing ? (
          <form onSubmit={handleSubmitEdit} className="space-y-2">
            <input
              type="text"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              className="border px-2 py-1 rounded w-full"
            />
            <input
              type="text"
              value={editData.location}
              onChange={(e) =>
                setEditData({ ...editData, location: e.target.value })
              }
              className="border px-2 py-1 rounded w-full"
            />
            <div className="space-x-2">
              <button
                type="submit"
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="bg-gray-400 px-2 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-yellow-400 px-2 py-1 rounded"
          >
            Edit Station
          </button>
        )}
        <button
          onClick={handleDeleteStation}
          className="bg-red-500 text-white px-2 py-1 rounded"
        >
          Delete Station
        </button>
      </div>

      {/* Pump Manager */}
      <div className="mt-6">
        <PumpManager
          stationId={stationId}
          pumps={station.pumps}
          setPumps={(updatedPumps) =>
            setStation({ ...station, pumps: updatedPumps })
          }
        />
      </div>

      {/* Staff Manager */}
      <div className="mt-6">
        <StaffManager
          stationId={stationId}
          staff={station.staff}
          setStaff={(updatedStaff) =>
            setStation({ ...station, staff: updatedStaff })
          }
        />
      </div>
    </div>
  );
}
