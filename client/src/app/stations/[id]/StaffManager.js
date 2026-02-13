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
      <h2 className="text-xl font-semibold" style={{color: '#b2b8b7'}}>Staff</h2>

      {/* Add Staff Form */}
      <Formik
        initialValues={{ name: "", role: "" }}
        validationSchema={staffSchema}
        onSubmit={handleAddStaff}
      >
        {() => (
          <Form className="mt-4 p-4 rounded-lg border" style={{backgroundColor: '#b2b8b7'}}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{color: '#000000'}}>
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
                <label className="block text-sm font-medium mb-1" style={{color: '#000000'}}>
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
                  className="w-full px-4 py-2 rounded-md focus:outline-none text-black"
                  style={{backgroundColor: '#cfcfcf', borderRadius: '8px'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#b8b8b8'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#cfcfcf'}
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
              className="rounded-lg border p-4"
              style={{backgroundColor: '#b2b8b7', borderRadius: '8px'}}
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
                    <Form className="grid grid-cols-1 md:grid-cols-4 gap-2 items-center">
                      <Field
                        type="text"
                        name="name"
                        className="border border-gray-300 px-3 py-2 rounded-md"
                      />
                      <Field
                        as="select"
                        name="role"
                        className="border border-gray-300 px-3 py-2 rounded-md"
                      >
                        <option value="">Select role</option>
                        <option value="Manager">Manager</option>
                        <option value="Attendant">Attendant</option>
                        <option value="Cashier">Cashier</option>
                        <option value="Supervisor">Supervisor</option>
                        <option value="Mechanic">Mechanic</option>
                      </Field>
                      <button
                        type="submit"
                        className="px-3 py-2 text-black rounded-md focus:outline-none"
                        style={{backgroundColor: '#cfcfcf', borderRadius: '8px'}}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#b8b8b8'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#cfcfcf'}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3 py-2 text-black rounded-md focus:outline-none"
                        style={{backgroundColor: '#cfcfcf', borderRadius: '8px'}}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#b8b8b8'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#cfcfcf'}
                      >
                        Cancel
                      </button>
                      <div className="col-span-full text-red-500 text-sm">
                        <ErrorMessage name="name" />
                        <ErrorMessage name="role" />
                      </div>
                    </Form>
                  )}
                </Formik>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium" style={{color: '#000000'}}>{member.name}</h4>
                    <p className="text-sm" style={{color: '#000000'}}>{member.role}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingId(member.id)}
                      className="px-3 py-1 text-black text-xs font-medium rounded-md focus:outline-none"
                      style={{backgroundColor: '#cfcfcf', borderRadius: '8px'}}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#b8b8b8'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#cfcfcf'}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(member.id)}
                      className="px-3 py-1 text-black text-xs font-medium rounded-md focus:outline-none"
                      style={{backgroundColor: '#dea4aa', borderRadius: '8px'}}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#cf2d4d'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#dea4aa'}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p style={{color: '#b2b8b7'}}>No staff assigned yet</p>
        )}
      </div>
    </div>
  );
}
