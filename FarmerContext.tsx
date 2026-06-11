import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface FarmerProfile {
  name: string;
  state: string;
  district: string;
  landSize: number;
}

interface FarmerContextProps {
  profile: FarmerProfile | null;
  saveProfile: (profile: FarmerProfile) => void;
  clearProfile: () => void;
}

const FarmerContext = createContext<FarmerContextProps | undefined>(undefined);

export function FarmerProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<FarmerProfile | null>(null);

  useEffect(() => {
    // Load local profile for instant hackathon offline mapping
    const saved = localStorage.getItem('kisan_farmer_profile');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse farmer profile", e);
      }
    }
  }, []);

  const saveProfile = (newProfile: FarmerProfile) => {
    setProfile(newProfile);
    localStorage.setItem('kisan_farmer_profile', JSON.stringify(newProfile));
  };

  const clearProfile = () => {
    setProfile(null);
    localStorage.removeItem('kisan_farmer_profile');
  };

  return (
    <FarmerContext.Provider value={{ profile, saveProfile, clearProfile }}>
      {children}
    </FarmerContext.Provider>
  );
}

export const useFarmer = () => {
  const context = useContext(FarmerContext);
  if (!context) {
    throw new Error('useFarmer must be used within a FarmerProvider');
  }
  return context;
};
