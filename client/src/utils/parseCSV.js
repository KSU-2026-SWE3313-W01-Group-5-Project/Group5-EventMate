import Papa from 'papaparse';

export async function fetchAndParseCSV(filePath) {
    try {
        const response = await fetch(filePath);

        if (!response.ok) {
            console.error(`Could not parse csv file: ${filePath}`);
        }

        const csvText = await response.text();

        const result = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true,
        });

        return result.data;
    } catch (err) {
        console.error("Error fetching and parsing CSV:", err);
    }
}