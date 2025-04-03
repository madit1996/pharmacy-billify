
import { useState } from "react";
import { LabBillItem, LabCustomer, LabWaitlistPatient } from "@/types/lab-types";
import { initialWaitlistPatients } from "@/contexts/lab/LabInitialData";
import { useToast } from "@/hooks/use-toast";

export function useLabWaitlist(
  setBillItems: (items: LabBillItem[]) => void,
  setSelectedCustomer: (customer: LabCustomer | null) => void,
  setSearchTerm: (term: string) => void,
  customers: LabCustomer[]
) {
  const [waitlistPatients, setWaitlistPatients] = useState<LabWaitlistPatient[]>(initialWaitlistPatients);
  const { toast } = useToast();

  const handleSelectWaitlistPatient = (patient: LabWaitlistPatient) => {
    setBillItems(patient.tests);
    
    const matchingCustomer = customers.find(c => c.name === patient.name);
    
    if (matchingCustomer) {
      setSelectedCustomer(matchingCustomer);
      setSearchTerm(matchingCustomer.name);
    } else {
      const newCustomer = {
        id: patient.id,
        name: patient.name,
        mobile: "Unknown",
        address: "Unknown"
      };
      setSelectedCustomer(newCustomer);
      setSearchTerm(newCustomer.name);
    }
    
    toast({
      title: "Patient loaded",
      description: `${patient.name}'s recommended tests loaded`,
    });
    
    const updatedWaitlist = waitlistPatients.map(p => ({
      ...p,
      isHighlighted: p.id === patient.id
    }));
    
    setWaitlistPatients(updatedWaitlist);
  };

  const removeFromWaitlist = (patientName: string) => {
    const updatedWaitlist = waitlistPatients.filter(
      p => p.name.toLowerCase() !== patientName.toLowerCase()
    );
    setWaitlistPatients(updatedWaitlist);
  };

  return {
    waitlistPatients,
    handleSelectWaitlistPatient,
    removeFromWaitlist
  };
}
