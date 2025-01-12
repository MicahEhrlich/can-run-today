import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number, callback: (debouncedValue: T) => void): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
            callback(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay, callback]); // Removed callback from dependency array

    return debouncedValue;
}

export default useDebounce;
