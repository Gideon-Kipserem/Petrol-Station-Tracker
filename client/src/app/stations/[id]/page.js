import { getStationById } from "@/app/Lib/api";

export default async function StationDetail({ params }) {
  const station = await getStationById(params.id);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{station.name}</h1>
      <p className="text-gray-600">{station.location}</p>

      { /* Pumps */ }
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Pumps</h2>
        <ul className="mt-2 space-y-2">
          {station.pumps.length > 0 ? (
            station.pumps.map((pump) => (
              <li key={pump.id} className="border rounded p-2">
                {pump.pump_number}
              </li>
            ))
          ) : (
            <p className="text-gray-500">No pumps assigned yet</p>
          )}
        </ul>
      </div>

      {/* Staff */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Staff</h2>
        <ul className="mt-2 space-y-2">
          {station.staff.length > 0 ? (
            station.staff.map((member) => (
              <li key={member.id} className="border rounded p-2">
                <strong>{member.name}</strong> — {member.role}
              </li>
            ))
          ) : (
            <p className="text-gray-500">No staff assigned yet</p>
          )}
        </ul>
      </div>
    </div>
  );
}
