"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  getPumpsByStation,
  addPump,
  updatePump,
  deletePump,
} from "../../Lib/api";

export default function PumpManager({ stationId, initialPumps }) {
  const [pumps, setPumps] = useState(initialPumps || []);
  const [editingPumpId, setEditingPumpId] = useState(null);

  // Fetch pumps fresh when the component mounts
  useEffect(() => {
    async function fetchPumps() {
      try {
        const data = await getPumpsByStation(stationId);
        setPumps(data);
      } catch (error) {
        console.error("Error fetching pumps:", error);
      }
    }
    fetchPumps();
  }, [stationId]);

  // Yup validation
  const pumpSchema = Yup.object().shape({
    pump_number: Yup.string()
      .required("Pump number is required")
      .min(2, "Must be at least 2 characters"),
    fuel_type: Yup.string()
      .required("Fuel type is required")
      .matches(/^[A-Za-z ]+$/, "Fuel type must contain only letters"),
  });

  const handleAddPump = async (values, { resetForm }) => {
    try {
      console.log("Adding pump with values:", values);
      console.log("Station ID:", stationId);
      const addedPump = await addPump(stationId, values);
      console.log("Added pump response:", addedPump);
      setPumps([...pumps, addedPump]);
      resetForm();
      alert("Pump added successfully!");
    } catch (error) {
      console.error("Error adding pump:", error);
      alert(`Failed to add pump: ${error.message}`);
    }
  };

  const handleUpdatePump = async (id, values) => {
    try {
      const updated = await updatePump(id, values);
      setPumps(pumps.map((p) => (p.id === id ? updated : p)));
      setEditingPumpId(null);
    } catch (error) {
      console.error("Error updating pump:", error);
    }
  };

  const handleDeletePump = async (id) => {
    try {
      await deletePump(id);
      setPumps(pumps.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting pump:", error);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold">Pumps</h2>

      {/* Formik form for adding pumps */}
      <Formik
        initialValues={{ pump_number: "", fuel_type: "" }}
        validationSchema={pumpSchema}
        onSubmit={handleAddPump}
      >
        {() => (
          <Form className="mt-4 bg-gray-50 p-4 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pump Number
                </label>
                <Field
                  type="text"
                  name="pump_number"
                  placeholder="e.g. Pump 5"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage name="pump_number" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Type
                </label>
                <Field
                  as="select"
                  name="fuel_type"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select fuel type</option>
                  <option value="Regular">Regular</option>
                  <option value="Premium">Premium</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Kerosene">Kerosene</option>
                </Field>
                <ErrorMessage name="fuel_type" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Pump
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      {pumps.length > 0 ? (
        <ul className="mt-2 space-y-2">
          {pumps.map((pump) => (
            <li
              key={pump.id}
              className="border rounded p-2 flex justify-between items-center"
            >
              {editingPumpId === pump.id ? (
                // Inline Formik edit form
                <Formik
                  initialValues={{
                    pump_number: pump.pump_number,
                  }}
                  validationSchema={pumpSchema}
                  onSubmit={(values) => handleUpdatePump(pump.id, values)}
                >
                  {() => (
                    <Form className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
                      <div>
                        <Field
                          type="text"
                          name="pump_number"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <Field
                          as="select"
                          name="fuel_type"
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="Regular">Regular</option>
                          <option value="Premium">Premium</option>
                          <option value="Diesel">Diesel</option>
                          <option value="Petrol">Petrol</option>
                          <option value="Kerosene">Kerosene</option>
                        </Field>
                      </div>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingPumpId(null)}
                        className="bg-gray-500 text-white px-3 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      >
                        Cancel
                      </button>
                    </Form>
                  )}
                </Formik>
              ) : (
                <>
                  <span>
                    {pump.pump_number} — {pump.fuel_type}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingPumpId(pump.id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePump(pump.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No pumps assigned yet</p>
      )}
    </div>
  );
}
