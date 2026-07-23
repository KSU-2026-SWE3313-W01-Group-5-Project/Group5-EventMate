/**
 * LocationTypeahead Component
 *
 * Return a reusable object that displays a text field where the user can begin to type in the name of their state and city
 * and the field will open a dropdown that filters through all matching states, and all the matching cities in that state after
 * they have specified a state
 *
 * This component works by making a call to our backend where I have created a function to download a file from our repo where I have
 * uploaded the 30,000 line csv (comma separated values list) that contains huge arrays of all 50 states and many of their cities
 * (along with other information that is not super important for this project, the only other information we will probably use is the
 * lat/long locations of each city for preference filtering)
 *
 * @param {string} props.statePlaceholder - Placeholder displayed in the state input.
 * This is passed in from the parent component instead of always using the user's
 * current state because different pages may want to display different values.
 * For example, the Profile Settings page should display the user's current
 * location, while the EventDetails.jsx Preferences page should display the user's preferred
 * event location filter.
 *
 * @param {string} props.cityPlaceholder - Same as above, but for the city input.
 *
 * @param {Function} props.setState - State setter passed from the parent component.
 * Updates the parent's selected state whenever the user chooses a new state.
 *
 * @param {Function} props.setCity - State setter passed from the parent component.
 * Updates the parent's selected city whenever the user chooses a new city.
 *
 * @param {Object} props.user - The authenticated user object. May no longer be
 * required since placeholder values are now passed directly as props.
 */

import {useEffect, useRef, useState} from "react";
import {useCities} from "../../hooks/useCities.js";

export default function LocationTypeahead({state, city, setState, setCity, user}) {
    const [stateInputValue, setStateInputValue] = useState("");
    const [stateFiltered, setStateFiltered] = useState([]);

    const [cityInputValue, setCityInputValue] = useState("");
    const [cityFiltered, setCityFiltered] = useState([]);

    const [stateIsOpen, setStateIsOpen] = useState(false);
    const [cityIsOpen, setCityIsOpen] = useState(false);

    const [statePlaceholderValue, setStatePlaceHolder] = useState(state);
    const [cityPlaceholderValue, setCityPlaceHolder] = useState(city);

    useEffect(() => {
        setStatePlaceHolder(state);
        setCityPlaceHolder(city);
    }, [state, city]);

    // Included is also the containerRef which is used to add the functionality to automatically close the dropdowns when a user clicks off of them
    const containerRef = useRef(null);

    // This is what is calling to our useCities hook in hooks/useCities.js and is what fetches the huge object of cities
    const { cities, loading } = useCities();

    // Function responsible for setting state input value, passing the input value the user has chosen back to the parent page,
    // filtering through all of the states in the cities object (the keys), and creating a list of states that match what the user
    // has typed so far
    // If I had more time and did not feel it a waste, I would definitely add some improvements to this system like making sure a user can not
    // just type in gibberish and be able to save it. Right now a user is not forced to pick from the list of states, which is an oversight
    // but for this projects purpose, there is no immediate need to fix it (and it would be pretty simple anyways)
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

    // Simply sets the state value when a user clicks on one of the options in the dropdown
    const handleStateSelect = (value) => {
        setStateInputValue(value);
        setState(value);
        setStateIsOpen(false);
    }

    // Basically the same concepts from the above state functionality
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
            )
        );

        setCityFiltered(matched);
        setCityIsOpen(true);
    }

    const handleCitySelect = (value) => {
        setCityInputValue(value);
        setCity(cityFiltered.find((cityObj) => cityObj.city.toLowerCase().includes(value.toLowerCase())));
        setCityIsOpen(false);
    }

    // Responsible for adding an event listener to this component and uses the ref that was described above to detect when a user
    // clicks on something that is not the dropdown
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
            {/* State input box and dropdown */}
            <div className="relative flex-1">
                <input
                    type="text"
                    value={stateInputValue}
                    onChange={handleStateInputChange}
                    className="w-full focus:outline-none"
                    placeholder={statePlaceholderValue ? statePlaceholderValue.toString() : "Type to search states..."}
                />

                {/* This dropdown pops up when the user begins to type in the state input box */}
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

            {/* City input box and dropdown */}
            <div className="relative flex-1">
                <input
                    type="text"
                    value={cityInputValue}
                    onChange={handleCityInputChange}
                    className="flex-1 focus:outline-none"
                    placeholder={cityPlaceholderValue ? cityPlaceholderValue.toString() : "Type to search cities..."}
                    disabled={stateInputValue.length === 0}
                />

                {/* This dropdown pops up when the user begins to type in the city input box */}
                {cityIsOpen && cityFiltered.length > 0 && (
                    <ul className="absolute left-0 top-full mt-1 w-full bg-white border border-stone-300 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto">
                        {cityFiltered.map(city => (
                            <li
                                key={`${city.city}-${city.lat}`}
                                onClick={() => handleCitySelect(city.city)}
                                className="px-3 py-2 hover:bg-stone-100 cursor-pointer"
                            >
                                {city.city}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    )
}