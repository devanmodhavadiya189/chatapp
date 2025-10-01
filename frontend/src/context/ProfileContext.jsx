import { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [showProfile, setShowProfile] = useState(false);

  const openProfile = () => setShowProfile(true);
  const closeProfile = () => setShowProfile(false);

  return (
    <ProfileContext.Provider value={{
      showProfile,
      openProfile,
      closeProfile
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};