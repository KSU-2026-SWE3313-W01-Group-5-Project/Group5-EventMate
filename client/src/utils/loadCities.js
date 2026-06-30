import parseCSV from "./parseCSV.js";

let cachedCities = null;

export default async function loadCities() {
    if (cachedCities) return cachedCities;

    const groupedCities = {};

    const res = await fetch("http://localhost:3000/api/cities");
    const csvText = await res.text();

    const csvData = await parseCSV(csvText);

    csvData.forEach(({ city, state_name, lat, lng}) => {
        if (!groupedCities[state_name]) groupedCities[state_name] = [];
        groupedCities[state_name].push({city, lat, lng});
    })

    return groupedCities;
}