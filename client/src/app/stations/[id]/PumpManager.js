"use client";

import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  getPumpsByStation,
  addPump,
  updatePump,
  deletePump,
} from "@/app/Lib/api";

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
      const addedPump = await addPump(stationId, values);
      setPumps([...pumps, addedPump]);
      resetForm();
    } catch (error) {
      console.error("Error adding pump:", error);
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
                    fuel_type: pump.fuel_type,
                  }}
                  validationSchema={pumpSchema}
                  onSubmit={(values) => handleUpdatePump(pump.id, values)}
                >
                  {() => (
                    <Form className="flex space-x-2 items-center">
                      <Field
                        type="text"
                        name="pump_number"
                        className="border px-2 py-1 rounded"
                      />
                      <Field
                        type="text"
                        name="fuel_type"
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
                        onClick={() => setEditingPumpId(null)}
                        className="bg-gray-400 px-2 py-1 rounded"
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
                  <div className="space-x-2">
                    <button
                      onClick={() => setEditingPumpId(pump.id)}
                      className="bg-yellow-400 px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePump(pump.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
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

      {/* Formik form for adding pumps */}
      <Formik
        initialValues={{ pump_number: "", fuel_type: "" }}
        validationSchema={pumpSchema}
        onSubmit={handleAddPump}
      >
        {() => (
          <Form className="mt-4 flex flex-col space-y-2">
            <div className="flex space-x-2 items-center">
              <Field
                type="text"
                name="pump_number"
                placeholder="Pump Number e.g Pump 5"
                className="border px-2 py-1 rounded"
              />
              <Field
                type="text"
                name="fuel_type"
                placeholder="Fuel Type"
                className="border px-2 py-1 rounded"
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-1 rounded"
              >
                Add Pump
              </button>
            </div>
            <div className="text-red-500 text-sm">
              <ErrorMessage name="pump_number" />
              <ErrorMessage name="fuel_type" />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
