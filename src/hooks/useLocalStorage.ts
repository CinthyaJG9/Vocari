import { useState, useEffect } from 'react';
import type { UserProfile } from '../types';

export const useLocalStorage = (key: string, initialValue: UserProfile[]) => {
  const [storedValue, setStoredValue] = useState<UserProfile[]>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
};