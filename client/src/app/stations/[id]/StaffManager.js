"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  getStaffByStation,
  addStaff,
  updateStaff,
  deleteStaff,
} from "@/app/Lib/api";

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

      <ul className="mt-2 space-y-2">
        {staffList.length > 0 ? (
          staffList.map((member) => (
            <li
              key={member.id}
              className="border rounded p-2 flex justify-between items-center"
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
                <>
                  <span>
                    {member.name} — {member.role}
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => setEditingId(member.id)}
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
                  </div>
                </>
              )}
            </li>
          ))
        ) : (
          <p className="text-gray-500">No staff assigned yet</p>
        )}
      </ul>

      {/* Add Staff Form */}
      <Formik
        initialValues={{ name: "", role: "" }}
        validationSchema={staffSchema}
        onSubmit={handleAddStaff}
      >
        {() => (
          <Form className="mt-4 flex flex-col space-y-2">
            <div className="flex space-x-2 items-center">
              <Field
                type="text"
                name="name"
                placeholder="Staff Name"
                className="border px-2 py-1 rounded"
              />
              <Field
                type="text"
                name="role"
                placeholder="Role"
                className="border px-2 py-1 rounded"
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-1 rounded"
              >
                Add Staff
              </button>
            </div>
            <div className="text-red-500 text-sm">
              <ErrorMessage name="name" />
              <ErrorMessage name="role" />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
