import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const SaleForm = ({ setSales, pumps, editingSale, setEditingSale, setShowForm }) => {
  const initialValues = editingSale
    ? {
        fuelType: editingSale.fuel_type,
        litres: editingSale.litres,
        pricePerLitre: editingSale.price_per_litre,
        pumpId: editingSale.pump_id,
      }
    : { fuelType: "", litres: "", pricePerLitre: "", pumpId: "" };

  const validationSchema = Yup.object({
    fuelType: Yup.string()
      .oneOf([ "Diesel", "Petrol", "Kerosene", "Premium", "Regular"], "Invalid fuel type")
      .required("Fuel type is required"),
    litres: Yup.number()
      .positive("Litres must be greater than 0")
      .required("Litres is required"),
    pricePerLitre: Yup.number()
      .positive("Price must be greater than 0")
      .test(
        "max-decimals",
        "Max 2 decimals allowed",
        (value) => /^\d+(\.\d{1,2})?$/.test(value)
      )
      .required("Price per litre is required"),
    pumpId: Yup.string().required("Select a pump"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    const payload = {
      fuelType: values.fuelType,
      litres: Number(values.litres),
      pricePerLitre: Number(values.pricePerLitre),
      totalAmount: Number(values.litres) * Number(values.pricePerLitre),
      pumpId: values.pumpId,
      userId: "user-1", // example user
    };

    try {
      if (editingSale) {
        const res = await fetch(`http://127.0.0.1:5555/sales/${editingSale.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const updated = await res.json();
        setSales((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        setEditingSale(null);
      } else {
        const res = await fetch("http://127.0.0.1:5555/sales", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const newSale = await res.json();
        setSales((prev) => [newSale, ...prev]);
      }
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Failed to save sale:", err);
    }
  };

  return (
    <>
      {editingSale ? (
        // Edit form - appears on right side
        <div className="fixed top-0 right-0 h-full w-[55%] z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full h-full overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit Sale</h3>
              <button
                onClick={() => { setEditingSale(null); setShowForm(false); }}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ×
              </button>
            </div>
            {/* Form Content */}
            <div className="p-6">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {() => (
                  <Form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                      <Field as="select" name="fuelType" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select fuel type</option>
                        <option value="Regular">Regular</option>
                        <option value="Premium">Premium</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Kerosene">Kerosene</option>
                      </Field>
                      <ErrorMessage name="fuelType" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Litres</label>
                      <Field type="number" name="litres" step="0.01" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                      <ErrorMessage name="litres" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price per Litre</label>
                      <Field type="number" name="pricePerLitre" step="0.01" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                      <ErrorMessage name="pricePerLitre" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pump</label>
                      <Field as="select" name="pumpId" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select a pump</option>
                        {pumps.map((pump) => (
                          <option key={pump.id} value={pump.id}>
                            {pump.pump_number} - {pump.station?.name || 'Unknown Station'} ({pump.fuel_type})
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="pumpId" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <button type="button" onClick={() => { setEditingSale(null); setShowForm(false); }} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Update Sale</button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      ) : (
        // Add form - appears centered
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[60%] max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add New Sale</h3>
              <button
                onClick={() => { setEditingSale(null); setShowForm(false); }}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ×
              </button>
            </div>
            {/* Form Content */}
            <div className="p-6">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {() => (
                  <Form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                      <Field as="select" name="fuelType" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select fuel type</option>
                        <option value="Regular">Regular</option>
                        <option value="Premium">Premium</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Petrol">Petrol</option>
                        <option value="Kerosene">Kerosene</option>
                      </Field>
                      <ErrorMessage name="fuelType" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Litres</label>
                      <Field type="number" name="litres" step="0.01" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                      <ErrorMessage name="litres" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price per Litre</label>
                      <Field type="number" name="pricePerLitre" step="0.01" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                      <ErrorMessage name="pricePerLitre" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pump</label>
                      <Field as="select" name="pumpId" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Select a pump</option>
                        {pumps.map((pump) => (
                          <option key={pump.id} value={pump.id}>
                            {pump.pump_number} - {pump.station?.name || 'Unknown Station'} ({pump.fuel_type})
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="pumpId" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <button type="button" onClick={() => { setEditingSale(null); setShowForm(false); }} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Add Sale</button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SaleForm;
