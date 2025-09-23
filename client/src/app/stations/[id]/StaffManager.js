"use client";

import { useState } from "react";
import { addStaff, updateStaff, deleteStaff } from "@/app/Lib/api";

export default function StaffManager({ stationId, initialStaff }) {
  const [staffList, setStaffList] = useState(initialStaff || []);
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingRole, setEditingRole] = useState("");

  // Add a new staff member
  async function handleAddStaff() {
    if (!newStaffName || !newStaffRole) return;

    try {
      const added = await addStaff(stationId, {
        name: newStaffName,
        role: newStaffRole,
      });
      setStaffList([...staffList, added]);
      setNewStaffName("");
      setNewStaffRole("");
    } catch (error) {
      console.error("Failed to add staff:", error);
    }
  }

  // Start editing a staff member
  function startEditing(staff) {
    setEditingId(staff.id);
    setEditingName(staff.name);
    setEditingRole(staff.role);
  }

  // Save edited staff member
  async function handleUpdateStaff(id) {
    if (!editingName || !editingRole) return;

    try {
      const updated = await updateStaff(id, {
        name: editingName,
        role: editingRole,
      });
      setStaffList(staffList.map((s) => (s.id === id ? updated : s)));
      setEditingId(null);
      setEditingName("");
      setEditingRole("");
    } catch (error) {
      console.error("Failed to update staff:", error);
    }
  }

  // Cancel editing
  function cancelEditing() {
    setEditingId(null);
    setEditingName("");
    setEditingRole("");
  }

  // Delete a staff member
  async function handleDeleteStaff(id) {
    try {
      await deleteStaff(id);
      setStaffList(staffList.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to delete staff:", error);
    }
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold">Staff</h2>

      <ul className="mt-2 space-y-2">
        {staffList.length > 0 ? (
          staffList.map((member) => (
            <li
              key={member.id}
              className="border rounded p-2 flex justify-between items-center"
            >
              {editingId === member.id ? (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="border px-2 py-1 rounded"
                  />
                  <input
                    type="text"
                    value={editingRole}
                    onChange={(e) => setEditingRole(e.target.value)}
                    className="border px-2 py-1 rounded"
                  />
                </div>
              ) : (
                <span>
                  {member.name} — {member.role}
                </span>
              )}

              <div className="space-x-2">
                {editingId === member.id ? (
                  <>
                    <button
                      onClick={() => handleUpdateStaff(member.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="bg-gray-400 px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEditing(member)}
                      className="bg-yellow-400 px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(member.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))
        ) : (
          <p className="text-gray-500">No staff assigned yet</p>
        )}
      </ul>

      {/* Add Staff Form */}
      <div className="mt-4 flex space-x-2 items-center">
        <input
          type="text"
          placeholder="Staff Name"
          value={newStaffName}
          onChange={(e) => setNewStaffName(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          placeholder="Role"
          value={newStaffRole}
          onChange={(e) => setNewStaffRole(e.target.value)}
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={handleAddStaff}
          className="bg-green-500 text-white px-4 py-1 rounded"
        >
          Add Staff
        </button>
      </div>
    </div>
  );
}
