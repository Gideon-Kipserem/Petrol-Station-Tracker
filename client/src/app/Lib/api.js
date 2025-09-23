export async function getStationById(id) {
    const res = await fetch('http://127.0.0.1:5555/stations/${id}', {
        cache: "no-store",

    });
    if(!res.ok) throw new Error ("Failed to fetch station");
    return res.json();
}