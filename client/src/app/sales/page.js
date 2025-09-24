"use client";
import React, { useEffect, useState } from "react";
import SaleForm from "../../components/SaleForm";


export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [pumps, setPumps] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingSale, setEditingSale] = useState(null);

  // Fetch sales & pumps from API
  useEffect(() => {
    async function fetchData() {
      try {
        const [salesRes, pumpsRes] = await Promise.all([
          fetch("http://127.0.0.1:5555/sales"),
          fetch("http://127.0.0.1:5555/pumps"),
        ]);

        if (!salesRes.ok || !pumpsRes.ok) throw new Error("Fetch failed");

        const salesData = await salesRes.json();
        const pumpsData = await pumpsRes.json();

        setSales(salesData);
        setPumps(pumpsData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Delete sale with confirmation
  async function handleDelete(id) {
    const confirmed = window.confirm("Are you sure you want to delete this sale?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://127.0.0.1:5555/sales/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setSales(sales.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) return <p className="text-gray-400">Loading...</p>;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Petrol Station Tracker</h1>
        <p className="text-gray-400">Manage fuel sales and transactions</p>
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-1">Sales Management</h2>
        <p className="text-gray-400">Manage fuel sales and transactions</p>
      </div>

      {/* Add Sale Button */}
      <div className="flex justify-end gap-4 mb-6">
        <button
          onClick={() => {
            setEditingSale(null);
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
        >
          Add Sale
        </button>
      </div>
      

      {/* Sale Form */}
      {showForm && (
        <SaleForm
          setSales={setSales}
          pumps={pumps}
          editingSale={editingSale}
          setEditingSale={setEditingSale}
          setShowForm={setShowForm}
        />
      )}

      {/* Sales History */}
      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-1">Sales History</h2>
        <p className="text-gray-400">All fuel sales transactions recorded in the system</p>
      </div>

      <div className="sales-history space-y-4">
        {sales.map((sale) => {
          let fuelColor = "";
          switch (sale.fuel_type) {
            case "Regular":
              fuelColor = "bg-green-600";
              break;
            case "Premium":
              fuelColor = "bg-yellow-500";
              break;
            case "Diesel":
              fuelColor = "bg-blue-600";
              break;
            default:
              fuelColor = "bg-gray-600";
          }

          return (
            <div
              key={sale.id}
              className="transaction flex justify-between items-center p-4 rounded-lg"
              style={{ backgroundColor: "#111", color: "white" }}
            >
              <div className="transaction-content space-y-1">
                <div className="transaction-line flex items-center gap-2">
                  <span className="volume font-semibold">{sale.litres}L</span>
                  <span className={`fuel-type px-2 py-1 rounded text-white ${fuelColor}`}>
                    {sale.fuel_type}
                  </span>
                  <span className="divider">•</span>
                  <span className="pump-info">Pump {sale.pump?.pump_number}</span>
                </div>
                <div className="transaction-line flex items-center gap-2 text-sm text-gray-300">
                  <span className="price-info">${sale.price_per_litre}/L</span>
                  <span className="divider">•</span>
                  <span className="date-info">{new Date(sale.sale_timestamp).toLocaleString()}</span>
                  <span className="divider">•</span>
                  <span className="contribution">Contribution: {sale.contribution || 0}</span>
                </div>
              </div>

              <div className="transaction-actions flex flex-col items-end gap-2">
                <div className="transaction-amount font-bold">${sale.total_amount.toFixed(2)}</div>
                <div className="action-icons flex gap-2">
                  <button
                    onClick={() => {
                      setEditingSale(sale);
                      setShowForm(true);
                    }}
                    className="icon-btn edit-icon px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(sale.id)}
                    className="icon-btn delete-icon px-2 py-1 rounded bg-red-600 hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
