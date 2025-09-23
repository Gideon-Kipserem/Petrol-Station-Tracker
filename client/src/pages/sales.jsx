import React, { useState } from "react";
import SaleForm from "../components/SaleForm";

function Sales() {
  const [sales, setSales] = useState([
    { id: 1, fuel_type: "Kerosene", litres: 10, price_per_litre: 120, total_amount: 1200, pump_id: 1, sale_timestamp: "2025-09-22T12:00:00" },
    { id: 2, fuel_type: "Diesel", litres: 5, price_per_litre: 110, total_amount: 550, pump_id: 2, sale_timestamp: "2025-09-21T15:30:00" },
    { id: 3, fuel_type: "Petrol", litres: 8, price_per_litre: 130, total_amount: 1040, pump_id: 1, sale_timestamp: "2025-09-20T09:45:00" }
  ]);

  const [pumps, setPumps] = useState([
    { id: 1, pump_number: "01" },
    { id: 2, pump_number: "02" }
  ]);

  const [editingSale, setEditingSale] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (sale) => {
    setEditingSale(sale);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;
    setSales(sales.filter((s) => s.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2 className="text-2xl font-bold">Sales Management</h2>
          <p className="text-gray-600">Manage fuel sales and transactions</p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Add Sale
          </button>
          </div>
      </div>

      {/* Summary Panel */}
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h3 className="text-lg font-semibold mb-2">Sales History</h3>
        <p>Total Sales: {sales.length}</p>
        <p>Total Revenue: ${sales.reduce((acc, s) => acc + s.total_amount, 0).toFixed(2)}</p>
        <p>Total Litres Sold: {sales.reduce((acc, s) => acc + s.litres, 0).toFixed(2)} L</p>
      </div>

      {/* Sale Form Modal */}
      {showForm && (
        <SaleForm
          setSales={setSales}
          pumps={pumps}
          editingSale={editingSale}
          setEditingSale={setEditingSale}
          setShowForm={setShowForm}
        />
      )}

      {/* Sales Table */}
      <table className="w-full border-collapse border">
        <thead>
  <tr>
    <th className="border px-2 py-1">Fuel Type</th>
    <th className="border px-2 py-1">Pump</th>
    <th className="border px-2 py-1">Litres</th>
    <th className="border px-2 py-1">Price/L</th>
    <th className="border px-2 py-1">Total</th>
    <th className="border px-2 py-1">Date</th>
    <th className="border px-2 py-1">Status</th>
    <th className="border px-2 py-1">Actions</th>
  </tr>
</thead>
        <tbody>
  {sales.map((sale) => {
    // Determine status label and color
    let statusLabel = "";
    let statusColor = "";
    if (sale.fuel_type === "Petrol") {
      statusLabel = "Regular";
      statusColor = "bg-blue-200";
    } else if (sale.fuel_type === "Diesel") {
      statusLabel = "Active";
      statusColor = "bg-green-200";
    } else if (sale.fuel_type === "Premium") {
      statusLabel = "Premium";
      statusColor = "bg-yellow-200";
    }

    return (
      <tr key={sale.id} className="hover:bg-gray-50">
        <td className="border px-2 py-1"><span className="px-2 py-1 bg-blue-100 rounded">{sale.fuel_type}</span></td>
        <td className="border px-2 py-1"><span className="px-2 py-1 bg-gray-200 rounded">{pumps.find(p => p.id === sale.pump_id)?.pump_number || "N/A"}</span></td>
        <td className="border px-2 py-1"><span className="px-2 py-1 bg-yellow-100 rounded">{sale.litres} L</span></td>
        <td className="border px-2 py-1"><span className="px-2 py-1 bg-green-100 rounded">${sale.price_per_litre}</span></td>
        <td className="border px-2 py-1"><span className="px-2 py-1 bg-purple-100 rounded">${sale.total_amount.toFixed(2)}</span></td>
        <td className="border px-2 py-1"><span className="px-2 py-1 bg-gray-100 rounded">{new Date(sale.sale_timestamp).toLocaleDateString()}</span></td>
        <td className="border px-2 py-1"><span className={`px-2 py-1 rounded font-semibold ${statusColor}`}>{statusLabel}</span></td>
        <td className="border px-2 py-1 space-x-2">
          <button onClick={() => handleEdit(sale)} className="text-blue-600">Edit</button>
          <button onClick={() => handleDelete(sale.id)} className="text-red-600">Delete</button>
        </td>
      </tr>
    );
  })}
</tbody>
      </table>
    </div>
  );
}

export default Sales;
