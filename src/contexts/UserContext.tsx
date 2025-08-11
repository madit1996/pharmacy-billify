import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Organization } from '@/types/ai-credits';

interface UserContextType {
  user: UserProfile | null;
  organization: Organization | null;
  setUser: (user: UserProfile | null) => void;
  setOrganization: (org: Organization | null) => void;
  isOrgAdmin: boolean;
  isDoctor: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);

  // Mock user data - replace with actual authentication
  useEffect(() => {
    // Simulate fetching user data
    const mockUser: UserProfile = {
      id: "user-1",
      name: "Dr. Sarah Johnson",
      email: "sarah.johnson@hospital.com",
      role: "doctor",
      organizationId: "org-1",
      isElitePlan: true
    };

    const mockOrg: Organization = {
      id: "org-1",
      name: "City General Hospital",
      doctorCount: 25,
      adminId: "admin-1"
    };

    setUser(mockUser);
    setOrganization(mockOrg);
  }, []);

  const isOrgAdmin = user?.role === "org_admin";
  const isDoctor = user?.role === "doctor";

  return (
    <UserContext.Provider
      value={{
        user,
        organization,
        setUser,
        setOrganization,
        isOrgAdmin,
        isDoctor
      }}
    >
      {children}
    </UserContext.Provider>
  );
};