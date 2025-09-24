"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllStations, addStation, deleteStation } from "../Lib/api";

export default function StationsPage() {
  const router = useRouter();
  const [stations, setStations] = useState([]);
  const [newStationName, setNewStationName] = useState("");
  const [newStationLocation, setNewStationLocation] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function fetchStations() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAllStations();
        setStations(data);
      } catch (err) {
        console.error("Failed to fetch stations:", err);
        setError("Failed to load stations. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchStations();
  }, []);

  const handleAddStation = async (e) => {
    e.preventDefault();
    if (!newStationName.trim() || !newStationLocation.trim()) {
      setError("Please fill in all fields");
      return;
    }
    
    setIsAdding(true);
    setError(null);
    
    try {
      const added = await addStation({
        name: newStationName.trim(),
        location: newStationLocation.trim(),
      });
      setStations([...stations, added]);
      setNewStationName("");
      setNewStationLocation("");
    } catch (err) {
      console.error("Failed to add station:", err);
      setError(err.message || "Failed to add station. Please try again.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteStation = async (id, e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!window.confirm("Are you sure you want to delete this station? This action cannot be undone.")) {
      return;
    }
    
    try {
      await deleteStation(id);
      setStations(stations.filter(station => station.id !== id));
    } catch (err) {
      console.error("Failed to delete station:", err);
      alert("Failed to delete station. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Petrol Stations</h1>
        <Link 
          href="/" 
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Add Station Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Station</h2>
        <form onSubmit={handleAddStation} className="space-y-4">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
              <p>{error}</p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Station Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={newStationName}
                onChange={(e) => setNewStationName(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter station name"
                required
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="location"
                value={newStationLocation}
                onChange={(e) => setNewStationLocation(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter location"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isAdding}
              className={`px-6 py-2 rounded-md text-white ${isAdding ? 'bg-green-400' : 'bg-green-500 hover:bg-green-600'} transition-colors flex items-center`}
            >
              {isAdding ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </>
              ) : (
                'Add Station'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Stations List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">All Stations</h2>
        </div>
        
        {stations.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No stations found. Add your first station above.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {stations.map((station) => (
              <li key={station.id} className="hover:bg-gray-50 transition-colors">
                <Link href={`/stations/${station.id}`}>
                  <div className="px-6 py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{station.name}</h3>
                        <p className="text-gray-600">
                          <i className="fas fa-map-marker-alt mr-2 text-blue-500"></i>
                          {station.location}
                        </p>
                        <div className="mt-2 flex space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <i className="fas fa-gas-pump mr-1"></i>
                            {station.pumps?.length || 0} Pumps
                          </span>
                          <span className="flex items-center">
                            <i className="fas fa-users mr-1"></i>
                            {station.staff?.length || 0} Staff
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => handleDeleteStation(station.id, e)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          title="Delete Station"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                        <button
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                          title="View Details"
                        >
                          <i className="fas fa-chevron-right"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
