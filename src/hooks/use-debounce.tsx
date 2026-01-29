import { useEffect, useState } from 'react';

/**
 * useDebounce Hook
 * @param value The value to debounce (e.g., search term)
 * @param delay The delay in milliseconds (default: 500ms)
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: Clear the timer if value or delay changes before the timer hits
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
