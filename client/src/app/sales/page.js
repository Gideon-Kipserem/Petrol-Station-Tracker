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

  if (loading) return <p className="text-gray-600">Loading...</p>;

  return (
    <div className="min-h-full text-gray-900 max-w-[60%] mx-auto">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Management</h1>
          <p className="text-gray-600 mt-1">Manage fuel sales and transactions</p>
        </div>
        <button
          onClick={() => {
            setEditingSale(null);
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-md text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          Add New Sale
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

      {/* Sales Summary by Station */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Sales by Station</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(() => {
            // Group sales by station
            const salesByStation = sales.reduce((acc, sale) => {
              const stationName = sale.pump?.station?.name || 'Unknown Station';
              if (!acc[stationName]) {
                acc[stationName] = { count: 0, total: 0, litres: 0 };
              }
              acc[stationName].count += 1;
              acc[stationName].total += sale.total_amount;
              acc[stationName].litres += sale.litres;
              return acc;
            }, {});

            return Object.entries(salesByStation).map(([stationName, stats]) => (
              <div key={stationName} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{stationName}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Sales:</span>
                      <span className="font-medium text-gray-900">{stats.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-medium text-gray-900">ksh{stats.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Litres:</span>
                      <span className="font-medium text-gray-900">{stats.litres.toFixed(1)}L</span>
                    </div>
                  </div>
                </div>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Sales History */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Sales History</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div key={sale.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className="volume font-semibold text-gray-900 text-lg">{sale.litres}L</span>
                    <span className={`fuel-type px-2 py-1 rounded text-white text-sm ${fuelColor}`}>
                      {sale.fuel_type}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="transaction-amount font-bold text-gray-900 text-lg">ksh{sale.total_amount.toFixed(2)}</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-600 mb-2">{sale.pump?.pump_number} - {sale.pump?.station?.name || 'Unknown Station'}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>ksh{sale.price_per_litre}/L</span>
                    <span>{new Date(sale.sale_timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingSale(sale);
                        setShowForm(true);
                      }}
                      className="flex-1 px-3 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sale.id)}
                      className="flex-1 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
