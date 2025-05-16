
import { createContext, ReactNode, useContext, useState } from "react";
import { 
  BloodUnit, 
  BloodDonor, 
  BloodRequest, 
  BloodInventorySummary, 
  BloodDonationCamp,
  BloodGroup
} from "@/types/blood-bank";
import { useBloodBank } from "@/hooks/blood-bank/useBloodBank";

interface BloodBankContextType {
  bloodUnits: BloodUnit[];
  donors: BloodDonor[];
  requests: BloodRequest[];
  camps: BloodDonationCamp[];
  inventory: BloodInventorySummary[];
  addBloodUnit: (unit: Omit<BloodUnit, "id">) => void;
  updateBloodUnit: (unit: BloodUnit) => void;
  deleteBloodUnit: (id: string) => void;
  addDonor: (donor: Omit<BloodDonor, "id">) => void;
  updateDonor: (donor: BloodDonor) => void;
  deleteDonor: (id: string) => void;
  addRequest: (request: Omit<BloodRequest, "id">) => void;
  updateRequest: (request: BloodRequest) => void;
  deleteRequest: (id: string) => void;
  addCamp: (camp: Omit<BloodDonationCamp, "id">) => void;
  updateCamp: (camp: BloodDonationCamp) => void;
  deleteCamp: (id: string) => void;
  getBloodTypeCompatibility: (bloodType: BloodGroup) => BloodGroup[];
  getDonorAnalytics: () => { bloodGroup: BloodGroup; count: number }[];
  getRequestAnalytics: () => { status: string; count: number }[];
  getCampPerformance: () => { campName: string; donors: number; expected: number }[];
}

const BloodBankContext = createContext<BloodBankContextType | undefined>(undefined);

export const BloodBankProvider = ({ children }: { children: ReactNode }) => {
  const bloodBank = useBloodBank();

  return (
    <BloodBankContext.Provider value={bloodBank}>
      {children}
    </BloodBankContext.Provider>
  );
};

export const useBloodBankContext = () => {
  const context = useContext(BloodBankContext);
  if (context === undefined) {
    throw new Error("useBloodBankContext must be used within a BloodBankProvider");
  }
  return context;
};
