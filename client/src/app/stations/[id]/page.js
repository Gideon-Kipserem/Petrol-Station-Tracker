"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getStationById, updateStation, deleteStation } from "@/app/Lib/api";
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
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
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
      {/* Header with station info and actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{station.name}</h1>
            <p className="text-gray-600 mt-1">
              <i className="fas fa-map-marker-alt mr-2"></i>
              {station.location}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-2 bg-yellow-400 text-gray-800 rounded hover:bg-yellow-500 transition-colors flex items-center"
            >
              <i className="fas fa-edit mr-2"></i>
              Edit
            </button>
            <button
              onClick={handleDeleteStation}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center"
            >
              <i className="fas fa-trash-alt mr-2"></i>
              Delete
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-gray-500 text-sm font-medium">Total Pumps</h3>
            <p className="text-2xl font-bold">{station.pumps?.length || 0}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-gray-500 text-sm font-medium">Staff Members</h3>
            <p className="text-2xl font-bold">{station.staff?.length || 0}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-gray-500 text-sm font-medium">Status</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          </div>
        </div>
      </div>

      {/* Pump Manager */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Pumps Management</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <PumpManager stationId={stationId} initialPumps={station.pumps} />
        </div>
      </div>

      {/* Staff Manager */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Staff Management</h2>
        <div className="bg-white rounded-lg shadow p-6">
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
