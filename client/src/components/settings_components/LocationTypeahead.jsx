import {useEffect, useRef, useState} from "react";
import {useCities} from "../../hooks/useCities.js";

export default function LocationTypeahead({statePlaceholder, cityPlaceholder, setState, setCity, user}) {
    const [stateInputValue, setStateInputValue] = useState("");
    const [stateFiltered, setStateFiltered] = useState([]);

    const [cityInputValue, setCityInputValue] = useState("");
    const [cityFiltered, setCityFiltered] = useState([]);

    const [stateIsOpen, setStateIsOpen] = useState(false);
    const [cityIsOpen, setCityIsOpen] = useState(false);
    const containerRef = useRef(null);

    const [statePlaceholderValue, setStatePlaceHolder] = useState(statePlaceholder);
    const [cityPlaceholderValue, setCityPlaceHolder] = useState(cityPlaceholder);

    const { cities, loading } = useCities();

    const handleStateInputChange = (e) => {
        const value = e.target.value;
        setStateInputValue(value);
        setState(value);

        if (value.trim() === '') {
            setStateFiltered([]);
            setStateIsOpen(false);
            return;
        }

        const matched = Object.keys(cities).filter((stateName) => {
            return stateName.toLowerCase().includes(value.toLowerCase())
        });

        setStateFiltered(matched);
        setStateIsOpen(true);
    }

    const handleStateSelect = (value) => {
        setStateInputValue(value);
        setState(value);
        setStateIsOpen(false);
    }

    const handleCityInputChange = (e) => {
        const value = e.target.value;
        setCityInputValue(value);
        setCity(value);

        if (value.trim() === '') {
            setCityFiltered([]);
            setCityIsOpen(false);
            return;
        }

        const matched = Array.from(
            new Set(
                (cities[stateInputValue] || [])
                    .filter(cityObj =>
                        cityObj.city.toLowerCase().includes(value.toLowerCase())
                    )
                    .map(cityObj => cityObj.city)
            )
        );

        setCityFiltered(matched);
        setCityIsOpen(true);
    }

    const handleCitySelect = (value) => {
        setCityInputValue(value);
        setCity(value);
        setCityIsOpen(false);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setStateIsOpen(false);
                setCityIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <div className="relative flex-1">
                <input
                    type="text"
                    value={stateInputValue}
                    onChange={handleStateInputChange}
                    className="w-full focus:outline-none"
                    placeholder={statePlaceholderValue ? statePlaceholderValue.toString() : "Type to search states..."}
                />

                {stateIsOpen && stateFiltered.length > 0 && (
                    <ul className="absolute left-0 top-full mt-1 w-full bg-white border border-stone-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                        {stateFiltered.map(state => (
                            <li
                                key={state}
                                onClick={() => handleStateSelect(state)}
                                className="px-3 py-2 hover:bg-stone-100 cursor-pointer"
                            >
                                {state}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div className="relative flex-1">
                <input
                    type="text"
                    value={cityInputValue}
                    onChange={handleCityInputChange}
                    className="flex-1 focus:outline-none"
                    placeholder={cityPlaceholderValue ? cityPlaceholderValue.toString() : "Type to search cities..."}
                    disabled={stateInputValue.length === 0}
                />

                {cityIsOpen && cityFiltered.length > 0 && (
                    <ul className="absolute left-0 top-full mt-1 w-full bg-white border border-stone-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                        {cityFiltered.map(city => (
                            <li
                                key={city}
                                onClick={() => handleCitySelect(city)}
                                className="px-3 py-2 hover:bg-stone-100 cursor-pointer"
                            >
                                {city}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    )
}