'use client';

export default function SalesPage() {
  // Mock data for demonstration
  const transactions = [
    { id: 1, litres: 45.5, fuelType: "Regular", pump: "Pump 1", pricePerLitre: 1.45, total: 65.98, date: "9/19/2025, 7:26 PM" },
    { id: 2, litres: 30.0, fuelType: "Premium", pump: "Pump 2", pricePerLitre: 1.65, total: 49.50, date: "9/19/2025, 7:26 PM" },
    { id: 3, litres: 60.2, fuelType: "Diesel", pump: "Pump 1", pricePerLitre: 1.55, total: 93.31, date: "9/19/2025, 7:26 PM" },
    { id: 4, litres: 25.8, fuelType: "Regular", pump: "Pump 2", pricePerLitre: 1.45, total: 37.41, date: "9/19/2025, 7:26 PM" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Petrol Station Tracker</h1>
        <p className="text-gray-400">Manage fuel sales and transactions</p>
      </div>

    <div className="mb-6">
    <h2 className="text-2xl font-semibold mb-1">Sales Management</h2>
    <p className="text-gray-400">Manage fuel sales records, view history and totals</p>
    </div>



      {/* Add Sale Buttons */}
      <div className="flex justify-end gap-4 mb-6">
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors">
          Add Sale
        </button>
      </div>

    <div className="mb-4">
    <h2 className="text-2xl font-semibold mb-1">Sales History</h2>
    <p className="text-gray-400">All fuel sales transactions recorded in the system</p>
    </div>

      <div className="sales-history space-y-4">
  {[
    { volume: 45.5, fuelType: "Regular", pump: 1, price: 1.45, date: "9/19/2025, 7:26:48 PM", total: 65.98 },
    { volume: 30.0, fuelType: "Premium", pump: 2, price: 1.65, date: "9/19/2025, 7:26:48 PM", total: 49.50 },
    { volume: 60.2, fuelType: "Diesel", pump: 1, price: 1.55, date: "9/19/2025, 7:26:48 PM", total: 93.31 },
    { volume: 25.8, fuelType: "Regular", pump: 2, price: 1.45, date: "9/19/2025, 7:26:48 PM", total: 37.41 },
  ].map((sale, index) => {
    let fuelColor = "";
    switch (sale.fuelType) {
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
        key={index}
        className="transaction flex justify-between items-center p-4 rounded-lg"
        style={{ backgroundColor: "#111", color: "white" }}
      >
        <div className="transaction-content space-y-1">
          <div className="transaction-line flex items-center gap-2">
            <span className="volume font-semibold">{sale.volume}L</span>
            <span className={`fuel-type px-2 py-1 rounded text-white ${fuelColor}`}>
              {sale.fuelType}
            </span>
            <span className="divider">•</span>
            <span className="pump-info">Pump {sale.pump}</span>
          </div>
          <div className="transaction-line flex items-center gap-2 text-sm text-gray-300">
            <span className="price-info">${sale.price}/L</span>
            <span className="divider">•</span>
            <span className="date-info">{sale.date}</span>
          </div>
        </div>

        <div className="transaction-actions flex flex-col items-end gap-2">
          <div className="transaction-amount font-bold">${sale.total.toFixed(2)}</div>
          <div className="action-icons flex gap-2">
            <button className="icon-btn edit-icon px-2 py-1 rounded bg-gray-700 hover:bg-gray-600">Edit</button>
            <button className="icon-btn delete-icon px-2 py-1 rounded bg-red-600 hover:bg-red-500">Delete</button>
          </div>
        </div>
      </div>
    );
  })}
</div>


      {/* Sales Amount Boxes */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Sales Amounts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {transactions.map((tx) => (
            <div key={tx.id} className="bg-gray-700 p-4 rounded-lg shadow text-center">
              <div className="text-gray-300 text-sm mb-1">{tx.fuelType}</div>
              <div className="font-bold text-white text-lg">${tx.total.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
