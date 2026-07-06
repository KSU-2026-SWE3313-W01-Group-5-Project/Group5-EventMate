/**
 * useCities Hook
 *
 * Responsible for creating a hook much like the useAuth() hook created in AuthContext so any file can access the cities data
 * from the backend.
 */

import {useEffect, useState} from "react";
import loadCities from "../utils/loadCities.js";

export function useCities() {

    // Hook states to store the data and save a loading state to help keep rendering safe
    const [cities, setCities] = useState(null);
    const [loading, setLoading] = useState(true);

    // Grabs cities and sets the state on startup
    useEffect(() => {
        loadCities().then((data) => {
            setCities(data);
            setLoading(false);
        });
    }, []);

    return { cities, loading };
}