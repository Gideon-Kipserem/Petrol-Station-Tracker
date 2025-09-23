import { getAllStations } from "../Lib/api";

export default async function StationsPage() {
    const Stations = await getAllStations();

    return (
        <div>
            <h1>ALL STATIONS</h1>
            <ul>
                {Stations.map((station) => (
                    <li key= {station.id}>
                        {station.name} - {station.location}
                    </li>
                )
            )}
            </ul>
        </div>
    );
}