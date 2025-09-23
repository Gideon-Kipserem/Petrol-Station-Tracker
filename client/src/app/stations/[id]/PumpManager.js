"use client";

import { useState, useEffect } from "react";
import { getStationById, addPump, updatePump, deletePump } from "@/app/Lib/api";

export default function PumpManager({ stationId, pumps: initialPumps }) {
  const [station, setStation] = useState(null);
  const [newPumpNumber, setNewPumpNumber] = useState("");
  const [newPumpFuel, setNewPumpFuel] = useState("");

  useEffect(() => {
    async function fetchStation() {
      try {
        const data = await getStationById(stationId);
        setStation(data);
      } catch (error) {
        console.error("Error fetching station:", error);
      }
    }
    fetchStation();
  }, [stationId]);

  const handleAddPump = async () => {
    if (!newPumpNumber || !newPumpFuel) return;

    try {
      const addedPump = await addPump(stationId, {
        pump_number: newPumpNumber,
        fuel_type: newPumpFuel,
      });

      setStation({
        ...station,
        pumps: [...station.pumps, addedPump],
      });

      setNewPumpNumber("");
      setNewPumpFuel("");
    } catch (error) {
      console.error("Error adding pump:", error);
    }
  };

  const handleUpdatePump = async (pumpId) => {
    try {
      const updatedPump = await updatePump(pumpId, { pump_number: "Updated Pump" });

      setStation({
        ...station,
        pumps: station.pumps.map((p) => (p.id === pumpId ? updatedPump : p)),
      });
    } catch (error) {
      console.error("Error updating pump:", error);
    }
  };

  const handleDeletePump = async (pumpId) => {
    try {
      await deletePump(pumpId);
      setStation({
        ...station,
        pumps: station.pumps.filter((p) => p.id !== pumpId),
      });
    } catch (error) {
      console.error("Error deleting pump:", error);
    }
  };

  if (!station) return <p>Loading station data...</p>;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold">Pumps</h2>
      {station.pumps.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {station.pumps.map((pump) => (
            <li key={pump.id} className="border rounded p-2 flex justify-between items-center">
              <span>{pump.pump_number} — {pump.fuel_type}</span>
              <div className="space-x-2">
                <button onClick={() => handleUpdatePump(pump.id)} className="bg-yellow-400 px-2 py-1 rounded">
                  Edit
                </button>
                <button onClick={() => handleDeletePump(pump.id)} className="bg-red-500 text-white px-2 py-1 rounded">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No pumps assigned yet</p>
      )}

      <div className="mt-4 flex space-x-2 items-center">
        <input
          type="text"
          placeholder="Pump Number"
          value={newPumpNumber}
          onChange={(e) => setNewPumpNumber(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          placeholder="Fuel Type"
          value={newPumpFuel}
          onChange={(e) => setNewPumpFuel(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button onClick={handleAddPump} className="bg-green-500 text-white px-4 py-1 rounded">
          Add Pump
        </button>
      </div>
    </div>
  );
}
