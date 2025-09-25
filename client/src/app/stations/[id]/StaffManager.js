"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  getStaffByStation,
  addStaff,
  updateStaff,
  deleteStaff,
} from "../../Lib/api";

export default function StaffManager({ stationId, initialStaff }) {
  const [staffList, setStaffList] = useState(initialStaff || []);
  const [editingId, setEditingId] = useState(null);

  // Fetch staff by stationId
  useEffect(() => {
    async function fetchStaff() {
      try {
        const data = await getStaffByStation(stationId);
        setStaffList(data);
      } catch (error) {
        console.error("Error fetching staff:", error);
      }
    }
    fetchStaff();
  }, [stationId]);

  // Validation schema
  const staffSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Must be at least 2 characters")
      .test(
        "two-words",
        "Name must contain at least two words",
        (value) => value && value.trim().split(/\s+/).length >= 2
      ),
    role: Yup.string()
      .required("Role is required")
      .matches(/^[A-Za-z ]+$/, "Role must contain only letters")
      .min(2, "Role must be at least 2 characters"),
  });

  // Add staff
  const handleAddStaff = async (values, { resetForm }) => {
    try {
      const added = await addStaff(stationId, values);
      setStaffList([...staffList, added]);
      resetForm();
    } catch (error) {
      console.error("Failed to add staff:", error);
    }
  };

  // Update staff
  const handleUpdateStaff = async (id, values) => {
    try {
      const updated = await updateStaff(id, values);
      setStaffList(staffList.map((s) => (s.id === id ? updated : s)));
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update staff:", error);
    }
  };

  // Delete staff
  const handleDeleteStaff = async (id) => {
    try {
      await deleteStaff(id);
      setStaffList(staffList.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to delete staff:", error);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold">Staff</h2>

      {/* Add Staff Form */}
      <Formik
        initialValues={{ name: "", role: "" }}
        validationSchema={staffSchema}
        onSubmit={handleAddStaff}
      >
        {() => (
          <Form className="mt-4 bg-gray-50 p-4 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Staff Name
                </label>
                <Field
                  type="text"
                  name="name"
                  placeholder="Enter staff name"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <Field
                  as="select"
                  name="role"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select role</option>
                  <option value="Manager">Manager</option>
                  <option value="Attendant">Attendant</option>
                  <option value="Cashier">Cashier</option>
                  <option value="Supervisor">Supervisor</option>
                  <option value="Mechanic">Mechanic</option>
                </Field>
                <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Staff
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      <div className="mt-4 grid gap-4">
        {staffList.length > 0 ? (
          staffList.map((member) => (
            <div
              key={member.id}
              className="bg-card rounded-lg shadow-sm border border-gray-200 p-12"
            >
              {editingId === member.id ? (
                // Inline Formik edit form
                <Formik
                  initialValues={{
                    name: member.name,
                    role: member.role,
                  }}
                  validationSchema={staffSchema}
                  onSubmit={(values) => handleUpdateStaff(member.id, values)}
                >
                  {() => (
                    <Form className="flex space-x-2 items-center">
                      <Field
                        type="text"
                        name="name"
                        className="border px-2 py-1 rounded"
                      />
                      <Field
                        type="text"
                        name="role"
                        className="border px-2 py-1 rounded"
                      />
                      <button
                        type="submit"
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                      <div className="text-red-500 text-sm">
                        <ErrorMessage name="name" />
                        <ErrorMessage name="role" />
                      </div>
                    </Form>
                  )}
                </Formik>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-900">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingId(member.id)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-xs font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(member.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No staff assigned yet</p>
        )}
      </div>
    </div>
  );
}
