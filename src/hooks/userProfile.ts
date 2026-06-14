import { useState, useEffect } from 'react';
import type { UserProfile } from '../types';

const STORAGE_KEY = 'vocari_profiles';

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null);

  // Función para obtener la clave de almacenamiento de un perfil
  const getProfileUnlockedAvatarsKey = (profileId: string) => `vocari_profile_${profileId}_unlocked_avatars`;
  const getProfileUnlockedThemesKey = (profileId: string) => `vocari_profile_${profileId}_unlocked_themes`;
  const getProfileThemeKey = (profileId: string) => `vocari_profile_theme_${profileId}`;

  // Cargar perfiles
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfiles(parsed);
      } catch (e) {
        console.error('Error cargando perfiles:', e);
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

  // Obtener avatares desbloqueados del perfil actual
  const getUnlockedAvatars = (profileId: string): string[] => {
    const key = getProfileUnlockedAvatarsKey(profileId);
    const saved = localStorage.getItem(key);
    const defaultAvatars = ['avatar1', 'avatar2', 'avatar3', 'cat', 'dog'];
    if (saved) {
      const parsed = JSON.parse(saved);
      return [...new Set([...defaultAvatars, ...parsed])];
    }
    return defaultAvatars;
  };

  // Obtener temas desbloqueados del perfil actual
  const getUnlockedThemes = (profileId: string): string[] => {
    const key = getProfileUnlockedThemesKey(profileId);
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  };

  // Desbloquear avatar para un perfil específico
  const unlockAvatarForProfile = (profileId: string, avatarId: string) => {
    const currentUnlocked = getUnlockedAvatars(profileId);
    if (!currentUnlocked.includes(avatarId)) {
      const newUnlocked = [...currentUnlocked, avatarId];
      localStorage.setItem(getProfileUnlockedAvatarsKey(profileId), JSON.stringify(newUnlocked));
      return true;
    }
    return false;
  };

  // Desbloquear tema para un perfil específico
  const unlockThemeForProfile = (profileId: string, themeId: string) => {
    const currentUnlocked = getUnlockedThemes(profileId);
    if (!currentUnlocked.includes(themeId)) {
      const newUnlocked = [...currentUnlocked, themeId];
      localStorage.setItem(getProfileUnlockedThemesKey(profileId), JSON.stringify(newUnlocked));
      return true;
    }
    return false;
  };

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
    
    // Limpiar datos del perfil eliminado
    localStorage.removeItem(getProfileUnlockedAvatarsKey(profileId));
    localStorage.removeItem(getProfileUnlockedThemesKey(profileId));
    localStorage.removeItem(getProfileThemeKey(profileId));
    
    if (currentProfile?.id === profileId) {
      setCurrentProfile(filtered[0] || null);
    }
    return filtered;
  };

  const updateAvatar = (profileId: string, newAvatar: string) => {
    updateProfile(profileId, { avatar: newAvatar });
    return true;
  };

  const isAvatarUnlocked = (profileId: string, avatarId: string): boolean => {
    return getUnlockedAvatars(profileId).includes(avatarId);
  };

  const isThemeUnlocked = (profileId: string, themeId: string): boolean => {
    return getUnlockedThemes(profileId).includes(themeId);
  };

  const updateProfileTheme = (profileId: string, themeClass: string) => {
    localStorage.setItem(getProfileThemeKey(profileId), themeClass);
  };

  const getProfileTheme = (profileId: string): string | null => {
    return localStorage.getItem(getProfileThemeKey(profileId));
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
    unlockAvatarForProfile,
    unlockThemeForProfile,
    getUnlockedAvatars,
    getUnlockedThemes,
    isAvatarUnlocked,
    isThemeUnlocked,
    updateProfileTheme,
    getProfileTheme,
  };
};