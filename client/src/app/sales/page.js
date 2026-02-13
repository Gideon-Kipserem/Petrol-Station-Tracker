"use client";
import React, { useEffect, useState } from "react";
import SaleForm from "../../components/SaleForm";


export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [pumps, setPumps] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [showAllSales, setShowAllSales] = useState(false);
  const [showAllStations, setShowAllStations] = useState(false);

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
          <h1 className="text-2xl font-bold text-gray-900 sales-management-heading">Sales Management</h1>
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

      {/* Sales Summary and History Side by Side */}
      <div className={`${showAllStations || showAllSales ? 'px-6' : 'flex justify-center px-6'}`}>
        <div className={`${showAllStations || showAllSales ? 'w-full space-y-8' : 'grid grid-cols-2 gap-2 max-w-3xl w-full'}`}>
          
          {/* Sales Summary by Station */}
          <div className={`${showAllStations || showAllSales ? 'w-full' : ''}`}>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{showAllStations ? 'All Stations Performance' : 'Top Performing Station'}</h2>
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

              // Sort by total sales and get top performer or all stations
              const sortedStations = Object.entries(salesByStation)
                .sort(([,a], [,b]) => b.total - a.total);
              
              const stationsToShow = showAllStations ? sortedStations : sortedStations.slice(0, 1);

              return (
                <>
                  <div className={showAllStations ? "space-y-4" : "space-y-6"}>
                    {stationsToShow.map(([stationName, stats]) => (
                      <div key={stationName} className={`sales-card bg-card rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col ${showAllStations ? 'w-full h-24' : 'w-72 h-72 mx-auto'}`}>
                        <div className={`${showAllStations ? 'p-3' : 'p-6'} flex-1 flex ${showAllStations ? 'flex-row items-center justify-between' : 'flex-col justify-between'}`}>
                          <div className={`${showAllStations ? 'text-left' : 'text-center mb-4'}`}>
                            <h3 className={`text-lg font-semibold text-gray-900 ${showAllStations ? 'mb-2' : 'mb-4'}`}>{stationName}</h3>
                            <div className={`font-bold text-gray-900 ${showAllStations ? 'text-xl' : 'text-3xl mb-2'}`}>ksh{stats.total.toFixed(2)}</div>
                          </div>
                          
                          <div className={`${showAllStations ? 'flex items-center space-x-6' : 'text-center space-y-3'}`}>
                            <div className={`bg-blue-50 rounded-lg ${showAllStations ? 'p-2 min-w-16' : 'p-3'}`}>
                              <div className={`font-bold text-blue-600 ${showAllStations ? 'text-sm' : 'text-2xl'}`}>{stats.count}</div>
                              <div className={`text-gray-600 ${showAllStations ? 'text-xs' : 'text-sm'}`}>Sales</div>
                            </div>
                            <div className={`bg-green-50 rounded-lg ${showAllStations ? 'p-2 min-w-16' : 'p-3'}`}>
                              <div className={`font-bold text-green-600 ${showAllStations ? 'text-sm' : 'text-2xl'}`}>{stats.litres.toFixed(1)}L</div>
                              <div className={`text-gray-600 ${showAllStations ? 'text-xs' : 'text-sm'}`}>Litres</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* View More Button for Stations */}
                  {sortedStations.length > 1 && (
                    <div className={`mt-6 ${showAllStations || showAllSales ? 'text-left' : 'text-center'}`}>
                      <button
                        onClick={() => setShowAllStations(!showAllStations)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                      >
                        {showAllStations ? 'Show Less' : `View More (${sortedStations.length - 1} more stations)`}
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          {/* Sales History */}
          <div className={`${showAllStations || showAllSales ? 'w-full' : ''}`}>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">{showAllSales ? 'All Sales History' : 'Recent Sales'}</h2>
            <div className={showAllSales ? "space-y-4" : "space-y-6"}>
        {(showAllSales ? sales : sales.slice(0, 1)).map((sale) => {
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
            <div key={sale.id} className={`sales-card bg-card rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col ${showAllSales ? 'w-full h-24' : 'w-72 h-72 mx-auto'}`}>
              <div className={`${showAllSales ? 'p-3' : 'p-6'} flex-1 flex ${showAllSales ? 'flex-row items-center justify-between' : 'flex-col justify-between'}`}>
                <div className={`${showAllSales ? 'text-left' : 'text-center mb-4'}`}>
                  <div className={`transaction-amount font-bold text-gray-900 ${showAllSales ? 'text-xl mb-1' : 'text-2xl mb-2'}`}>ksh{sale.total_amount.toFixed(2)}</div>
                  <div className={`${showAllSales ? 'flex items-center gap-2' : 'flex items-center justify-center gap-2 mb-2'}`}>
                    <span className={`volume font-semibold text-gray-900 ${showAllSales ? 'text-base' : 'text-lg'}`}>{sale.litres}L</span>
                    <span className={`fuel-type px-2 py-1 rounded text-white text-sm ${fuelColor}`}>
                      {sale.fuel_type}
                    </span>
                  </div>
                  {showAllSales && (
                    <p className="text-gray-600 text-sm">{sale.pump?.pump_number} - {sale.pump?.station?.name || 'Unknown Station'}</p>
                  )}
                </div>
                
                {!showAllSales && (
                  <div className="text-center mb-4">
                    <p className="text-gray-600 mb-2 text-sm">{sale.pump?.pump_number} - {sale.pump?.station?.name || 'Unknown Station'}</p>
                    <div className="text-sm text-gray-500">
                      <div>ksh{sale.price_per_litre}/L</div>
                      <div>{new Date(sale.sale_timestamp).toLocaleDateString()}</div>
                    </div>
                  </div>
                )}
                
                <div className={`${showAllSales ? 'flex items-center gap-3' : 'pt-4 border-t border-gray-100'}`}>
                  <div className={`${showAllSales ? 'flex items-center gap-3' : 'flex justify-center gap-3'}`}>
                    <button
                      onClick={() => {
                        setEditingSale(sale);
                        setShowForm(true);
                      }}
                      className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-xs font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sale.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-xs font-medium"
                    >
                      Delete
                    </button>
                  </div>
                  {showAllSales && (
                    <div className="text-sm text-gray-500 text-right">
                      <div>ksh{sale.price_per_litre}/L</div>
                      <div>{new Date(sale.sale_timestamp).toLocaleDateString()}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
            </div>
            
            {/* View More Button for Sales */}
            {sales.length > 1 && (
              <div className={`mt-6 ${showAllStations || showAllSales ? 'text-left' : 'text-center'}`}>
                <button
                  onClick={() => setShowAllSales(!showAllSales)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                  {showAllSales ? 'Show Less' : `View More (${sales.length - 1} more sales)`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
