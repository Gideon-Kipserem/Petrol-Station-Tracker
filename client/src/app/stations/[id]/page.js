"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getStationById, updateStation, deleteStation } from "../../Lib/api";
import PumpManager from "./PumpManager";
import StaffManager from "./StaffManager";

// Edit Station Modal Component
function EditStationModal({ isOpen, onClose, station, onSave }) {
  const [formData, setFormData] = useState({
    name: station?.name || '',
    location: station?.location || ''
  });

  useEffect(() => {
    if (station) {
      setFormData({
        name: station.name,
        location: station.location
      });
    }
  }, [station]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg p-12 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Station</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Station Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="location">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StationDetail() {
  const router = useRouter();
  const params = useParams();
  const stationId = params.id;

  const [station, setStation] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editData, setEditData] = useState({ name: "", location: "" });

  // Fetch station by ID
  useEffect(() => {
    async function fetchStation() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getStationById(stationId);
        setStation(data);
        setEditData({ name: data.name, location: data.location }); // preload form
      } catch (error) {
        console.error("Failed to fetch station:", error);
        setError("Failed to load station details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchStation();
  }, [stationId]);

  // Update station info
  const handleUpdateStation = async (formData) => {
    try {
      const updated = await updateStation(stationId, formData);
      setStation(updated);
      setEditData({ name: updated.name, location: updated.location });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update station:", error);
      alert("Failed to update station. Please try again.");
    }
  };

  // Delete station
  const handleDeleteStation = async () => {
    if (!window.confirm("Are you sure you want to delete this station? This action cannot be undone.")) {
      return;
    }
    
    try {
      await deleteStation(stationId);
      alert("Station deleted successfully!");
      router.push("/stations");
    } catch (error) {
      console.error("Failed to delete station:", error);
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

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p>{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="p-6">
        <p>Station not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Back button */}
      <button
        onClick={() => router.push("/stations")}
        className="bg-gray-300 hover:bg-gray-400 px-3 py-1 rounded mb-4 transition-colors"
      >
        Back to All Stations
      </button>

      {/* Header with station info and actions */}
      <div className="bg-card rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{station.name}</h1>
              <p className="text-gray-600 text-sm">
                <i className="fas fa-map-marker-alt mr-1"></i>
                {station.location}
              </p>
            </div>
            
            {/* Inline Stats */}
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center bg-blue-50 px-3 py-1 rounded-md">
                <span className="text-blue-600 font-medium">{station.pumps?.length || 0}</span>
                <span className="text-gray-500 ml-1">Pumps</span>
              </div>
              <div className="flex items-center bg-green-50 px-3 py-1 rounded-md">
                <span className="text-green-600 font-medium">{station.staff?.length || 0}</span>
                <span className="text-gray-500 ml-1">Staff</span>
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-3 py-1 bg-yellow-400 text-gray-800 rounded hover:bg-yellow-500 transition-colors flex items-center text-sm"
            >
              <i className="fas fa-edit mr-1"></i>
              Edit
            </button>
            <button
              onClick={handleDeleteStation}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center text-sm"
            >
              <i className="fas fa-trash-alt mr-1"></i>
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Pump Manager */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Pumps Management</h2>
        <div className="bg-card rounded-lg shadow p-12">
          <PumpManager stationId={stationId} initialPumps={station.pumps} />
        </div>
      </div>

      {/* Staff Manager */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Staff Management</h2>
        <div className="bg-card rounded-lg shadow p-12">
          <StaffManager stationId={stationId} initialStaff={station.staff} />
        </div>
      </div>

      {/* Edit Station Modal */}
      <EditStationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        station={station}
        onSave={handleUpdateStation}
      />
    </div>
  );
}
