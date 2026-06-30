import Papa from 'papaparse';

import citiescsv from '../assets/datasets/cities.csv?url'

export function fetchAndParseCitiesCSV() {
    return new Promise((resolve, reject) => {
        Papa.parse(citiescsv, {
            download: true,
            header: true,
            complete: (results) => {
                console.log("Successfully loaded project CSV:", results.data);
                resolve(results);
            },
            error: (error) => reject(error)
        });
    });
}