import {useEffect, useState} from "react";
import loadCities from "../utils/loadCities.js";

export function useCities() {
    const [cities, setCities] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCities().then((data) => {
            setCities(data);
            setLoading(false);
        });
    }, []);

    return { cities, loading };
}