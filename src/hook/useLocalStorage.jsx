// hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
    // Initialize state with a function to avoid unnecessary JSON parsing on every render
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            // Parse stored json or return initialValue if none
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Update localStorage when state changes
    useEffect(() => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore = storedValue instanceof Function ? storedValue(storedValue) : storedValue;
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
};

export default useLocalStorage;