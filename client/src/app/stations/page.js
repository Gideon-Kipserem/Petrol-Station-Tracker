"use client";
import { useEffect, useState } from "react";
import { getAllStations, updateStation } from "../Lib/api";
import { getStationById } from "../Lib/api";
import { addStation, deleteStation } from "../Lib/api";

export default async function StationsPage() {
  const [stations, setStations] = useState([]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  // Load stations
  useEffect(() => {
    getAllStations().then(setStations).catch(console.error);
  }, []);

  // Add station
  async function handleAdd(e) {
    e.preventDefault();
    const newStation = await addStation({ name, location });
    setStations([...stations, newStation]);
    setName("");
    setLocation("");
  }

  // Update
  async function handleUpdate(id) {
    const updated = await updateStation(id, { name: "New Name" });
    const newStations = stations.map((station) => {
      if (station.id == id) {
        return updateStation;
      } else {
        return station;
      }
    });
    setStations(newStations);
  }

  return (
    <div>
      <h1>STATIONS</h1>
      <form onSubmit={handleAdd}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Station name"
        ></input>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location"
        ></input>
      </form>

      <ul>
        {Stations.map((station) => (
          <li key={station.id}>
            {station.name} - {station.location}{" "}
            <button onClick={() => handleUpdate(station.id)}>Edit</button>
            <button onClick={() => handleUpdate(station.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
