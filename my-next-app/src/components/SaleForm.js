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
      .oneOf(["Diesel", "Petrol", "Kerosene", "Premium", "Regular"], "Invalid fuel type")
      .required("Fuel type is required"),
    litres: Yup.number()
      .positive("Litres must be greater than 0")
      .required("Litres is required"),
    pricePerLitre: Yup.number()
      .positive("Price must be greater than 0")
      .test("max-decimals", "Max 2 decimals allowed", (value) => /^\d+(\.\d{1,2})?$/.test(value))
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
    };

    try {
      if (editingSale) {
        const res = await fetch(`http://127.0.0.1:5000/sales/${editingSale.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const updated = await res.json();
        setSales((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        setEditingSale(null);
      } else {
        const res = await fetch("http://127.0.0.1:5000/sales", {
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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-900 p-6 rounded w-full max-w-md text-white">
        <div className="flex justify-between mb-4">
          <h3>{editingSale ? "Edit Sale" : "Add Sale"}</h3>
          <button
            onClick={() => { setEditingSale(null); setShowForm(false); }}
            className="text-white hover:text-red-500"
          >
            ×
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {() => (
            <Form className="space-y-3">
              <div>
                <label>Fuel Type</label>
                <Field name="fuelType" className="w-full border border-gray-700 bg-gray-800 p-2 rounded text-white" />
                <ErrorMessage name="fuelType" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label>Litres</label>
                <Field type="number" name="litres" className="w-full border border-gray-700 bg-gray-800 p-2 rounded text-white" />
                <ErrorMessage name="litres" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label>Price per Litre (ksh)</label>
                <Field type="number" name="pricePerLitre" className="w-full border border-gray-700 bg-gray-800 p-2 rounded text-white" />
                <ErrorMessage name="pricePerLitre" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label>Pump</label>
                <Field as="select" name="pumpId" className="w-full border border-gray-700 bg-gray-800 p-2 rounded text-white">
                  <option value="">Select a pump</option>
                  {pumps.map((pump) => (
                    <option key={pump.id} value={pump.id}>
                      Pump #{pump.pump_number}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="pumpId" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="flex justify-between mt-4">
                <button type="submit" className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white">
                  {editingSale ? "Update" : "Add"}
                </button>
                <button type="button" onClick={() => { setEditingSale(null); setShowForm(false); }} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-white">
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SaleForm;
