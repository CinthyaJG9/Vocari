import { useState, useEffect } from 'react';
import type { UserProfile } from '../types';

const STORAGE_KEY = 'vocari_profiles';

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);

  // Cargar perfiles guardados
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfiles(parsed);
      } catch (e) {
        console.error('Error cargando perfiles:', e);
        setProfiles([
          { id: "1", name: "Ana", age: 5, stars: 12, avatar: "avatar1" },
          { id: "2", name: "Pedro", age: 8, stars: 25, avatar: "dog" },
        ]);
      }
    } else {
      setProfiles([
        { id: "1", name: "Ana", age: 5, stars: 12, avatar: "avatar1" },
        { id: "2", name: "Pedro", age: 8, stars: 25, avatar: "dog" },
      ]);
    }
  }, []);

  // Guardar perfiles
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    }
  }, [profiles]);

  const addProfile = (profile: UserProfile) => {
    const newProfiles = [...profiles, profile];
    setProfiles(newProfiles);
    setCurrentProfile(profile);
    return profile;
  };

  const updateProfile = (profileId: string, updates: Partial<UserProfile>) => {
    const updated = profiles.map(p =>
      p.id === profileId ? { ...p, ...updates } : p
    );
    setProfiles(updated);
    
    if (currentProfile?.id === profileId) {
      setCurrentProfile({ ...currentProfile, ...updates });
    }
  };

  const updateStars = (profileId: string, starsToAdd: number) => {
    const updated = profiles.map(p =>
      p.id === profileId ? { ...p, stars: p.stars + starsToAdd } : p
    );
    setProfiles(updated);
    
    if (currentProfile?.id === profileId) {
      setCurrentProfile({ ...currentProfile, stars: currentProfile.stars + starsToAdd });
    }
  };

  const deleteProfile = (profileId: string) => {
    const filtered = profiles.filter(p => p.id !== profileId);
    setProfiles(filtered);
    if (currentProfile?.id === profileId) {
      setCurrentProfile(filtered[0] || null);
    }
    return filtered;
  };

  const updateAvatar = (profileId: string, newAvatar: string) => {
    updateProfile(profileId, { avatar: newAvatar });
  };

  return {
    profiles,
    currentProfile,
    setCurrentProfile,
    addProfile,
    updateProfile,
    updateStars,
    deleteProfile,
    updateAvatar,
  };
};