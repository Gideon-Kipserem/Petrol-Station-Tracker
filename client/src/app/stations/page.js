"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getAllStations } from "@/app/Lib/api";

export default function StationsPage() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    async function fetchStations() {
      const data = await getAllStations();
      setStations(data);
    }
    fetchStations();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">All Petrol Stations</h1>

      <ul className="space-y-2">
        {stations.map((station) => (
          <li
            key={station.id}
            className="border p-2 flex justify-between items-center rounded"
          >
            <span>
              {station.name} — {station.location}
            </span>
            {/* Link to the station detail page */}
            <Link
              href={`/stations/${station.id}`}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Open
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
