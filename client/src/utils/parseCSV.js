import Papa from 'papaparse';

export default async function parseCSV(csvText) {
    const { data } = Papa.parse(csvText, {

        // automatically uses the first row of the csv file as the columns for the JSON object
        header: true,

        skipEmptyLines: true,
    });

    return data;
}