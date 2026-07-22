/**
 * parseCSV utility function
 *
 * Responsible for accepting the CSV data from the backend, caching it, and filtering out just the names of the cities and
 * states and their lat/longs.
 */

import parseCSV from "./parseCSV.js";

let cachedCities = null;

export default async function loadCities() {
    if (cachedCities) return cachedCities;

    const groupedCities = {};

    const res = await fetch(import.meta.env.VITE_CITIES_API_URL);
    const csvText = await res.text();

    const csvData = await parseCSV(csvText);

    csvData.forEach(({ city, state_name, lat, lng}) => {
        if (!groupedCities[state_name]) groupedCities[state_name] = [];
        groupedCities[state_name].push({city, lat, lng});
    })

    return groupedCities;
}