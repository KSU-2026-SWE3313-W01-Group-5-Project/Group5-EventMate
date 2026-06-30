import Papa from 'papaparse';

export default async function parseCSV(csvText) {
    const { data } = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
    });

    return data;
}