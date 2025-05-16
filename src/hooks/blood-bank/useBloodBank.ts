import { useState } from "react";
import { 
  BloodUnit, 
  BloodDonor, 
  BloodRequest, 
  BloodInventorySummary, 
  BloodDonationCamp,
  BloodGroup,
  BloodTransfusion,
  BloodStockTransfer
} from "@/types/blood-bank";

// Sample mock data
const initialBloodUnits: BloodUnit[] = [
  {
    id: "bu1",
    bloodGroup: "A+",
    donationDate: "2025-05-01",
    expiryDate: "2025-06-01",
    volume: 450,
    status: "available",
    location: "Main Storage",
    donorId: "d1",
    crossMatchTested: true
  },
  {
    id: "bu2",
    bloodGroup: "O-",
    donationDate: "2025-04-25",
    expiryDate: "2025-05-25",
    volume: 450,
    status: "available",
    location: "Main Storage",
    donorId: "d3",
    crossMatchTested: true
  },
  {
    id: "bu3",
    bloodGroup: "B+",
    donationDate: "2025-05-02",
    expiryDate: "2025-06-02",
    volume: 450,
    status: "reserved",
    location: "Emergency Unit",
    donorId: "d2",
    crossMatchTested: true
  },
  {
    id: "bu4",
    bloodGroup: "A+",
    donationDate: "2025-04-20",
    expiryDate: "2025-05-20",
    volume: 450,
    status: "available",
    location: "Main Storage",
    donorId: "d4",
    crossMatchTested: true
  },
  {
    id: "bu5",
    bloodGroup: "AB+",
    donationDate: "2025-05-10",
    expiryDate: "2025-06-10",
    volume: 450,
    status: "available",
    location: "Surgery Department",
    donorId: "d5",
    crossMatchTested: false
  },
  {
    id: "bu6",
    bloodGroup: "O+",
    donationDate: "2025-05-05",
    expiryDate: "2025-06-05",
    volume: 450,
    status: "available",
    location: "Main Storage",
    donorId: "d6",
    crossMatchTested: true
  },
  {
    id: "bu7",
    bloodGroup: "A-",
    donationDate: "2025-04-28",
    expiryDate: "2025-05-28",
    volume: 450,
    status: "available",
    location: "Emergency Unit",
    donorId: "d7",
    crossMatchTested: true
  }
];

const initialDonors: BloodDonor[] = [
  {
    id: "d1",
    name: "John Smith",
    contactNumber: "555-1234",
    email: "john.smith@example.com",
    bloodGroup: "A+",
    lastDonationDate: "2025-05-01",
    donationCount: 5,
    eligibleDate: "2025-08-01"
  },
  {
    id: "d2",
    name: "Sarah Johnson",
    contactNumber: "555-5678",
    email: "sarah.j@example.com",
    bloodGroup: "B+",
    lastDonationDate: "2025-05-02",
    donationCount: 3,
    eligibleDate: "2025-08-02"
  },
  {
    id: "d3",
    name: "Michael Brown",
    contactNumber: "555-9012",
    email: "m.brown@example.com",
    bloodGroup: "O-",
    lastDonationDate: "2025-04-25",
    donationCount: 8,
    eligibleDate: "2025-07-25"
  }
];

const initialRequests: BloodRequest[] = [
  {
    id: "r1",
    patientId: "p101",
    patientName: "Emma Wilson",
    bloodGroup: "A+",
    quantity: 2,
    requestDate: "2025-05-10",
    requiredDate: "2025-05-12",
    status: "pending",
    priority: "normal",
    requestedBy: "Dr. Anderson",
    purpose: "Scheduled Surgery"
  },
  {
    id: "r2",
    patientId: "p102",
    patientName: "David Garcia",
    bloodGroup: "O-",
    quantity: 1,
    requestDate: "2025-05-15",
    requiredDate: "2025-05-15",
    status: "fulfilled",
    priority: "urgent",
    requestedBy: "Dr. Martinez",
    purpose: "Emergency Transfusion"
  }
];

const initialCamps: BloodDonationCamp[] = [
  {
    id: "c1",
    name: "Community Health Drive",
    location: "Central Community Center",
    address: "123 Main St, Anytown, AN 12345",
    organizer: "City Hospital",
    contactPerson: "Dr. Jennifer Lee",
    contactNumber: "555-7890",
    startDate: "2025-05-20",
    endDate: "2025-05-21",
    expectedDonors: 50,
    status: "scheduled",
    notes: "Annual blood drive event"
  },
  {
    id: "c2",
    name: "University Blood Drive",
    location: "State University Campus",
    address: "456 University Ave, Collegetown, CT 67890",
    organizer: "Red Cross",
    contactPerson: "Professor Williams",
    contactNumber: "555-4321",
    startDate: "2025-06-10",
    endDate: "2025-06-12",
    expectedDonors: 100,
    status: "scheduled",
    notes: "End of semester drive"
  },
  {
    id: "c3",
    name: "Corporate Wellness Camp",
    location: "Tech Innovation Park",
    address: "789 Corporate Blvd, Techville, TV 54321",
    organizer: "City Hospital",
    contactPerson: "HR Director Thompson",
    contactNumber: "555-6543",
    startDate: "2025-04-15",
    endDate: "2025-04-15",
    expectedDonors: 30,
    actualDonors: 25,
    status: "completed",
    notes: "Employee wellness initiative"
  }
];

// Sample blood transfusion data
const initialTransfusions: BloodTransfusion[] = [
  {
    id: "t1",
    patientId: "p101",
    patientName: "Emma Wilson",
    bloodUnitId: "bu3",
    bloodGroup: "B+",
    transfusionDate: "2025-05-12",
    administeredBy: "Nurse Johnson",
    transfusionStartTime: "09:30",
    transfusionEndTime: "11:45",
    vitalsBefore: {
      temperature: 36.8,
      heartRate: 72,
      bloodPressure: "120/80",
      respiratoryRate: 16,
      oxygenSaturation: 98
    },
    vitalsAfter: {
      temperature: 37.0,
      heartRate: 75,
      bloodPressure: "124/82",
      respiratoryRate: 16,
      oxygenSaturation: 97
    },
    status: "completed",
    notes: "Patient tolerated transfusion well."
  }
];

// Sample stock transfers
const initialTransfers: BloodStockTransfer[] = [
  {
    id: "tr1",
    fromLocation: "Main Storage",
    toLocation: "Emergency Unit",
    units: [
      { unitId: "bu3", bloodGroup: "B+" }
    ],
    transferDate: "2025-05-10",
    requestedBy: "Dr. Martinez",
    approvedBy: "Lab Manager Smith",
    status: "completed",
    notes: "Urgent transfer for scheduled surgery"
  }
];

export const useBloodBank = () => {
  const [bloodUnits, setBloodUnits] = useState<BloodUnit[]>(initialBloodUnits);
  const [donors, setDonors] = useState<BloodDonor[]>(initialDonors);
  const [requests, setRequests] = useState<BloodRequest[]>(initialRequests);
  const [camps, setCamps] = useState<BloodDonationCamp[]>(initialCamps);
  const [transfusions, setTransfusions] = useState<BloodTransfusion[]>(initialTransfusions);
  const [transfers, setTransfers] = useState<BloodStockTransfer[]>(initialTransfers);

  const calculateInventory = (): BloodInventorySummary[] => {
    const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    
    return bloodGroups.map(group => {
      const units = bloodUnits.filter(unit => unit.bloodGroup === group);
      const available = units.filter(unit => unit.status === 'available').length;
      const reserved = units.filter(unit => unit.status === 'reserved').length;
      
      return {
        bloodGroup: group,
        available,
        reserved,
        total: available + reserved
      };
    });
  };

  const addBloodUnit = (unit: Omit<BloodUnit, "id">) => {
    const newUnit = {
      ...unit,
      id: `bu${bloodUnits.length + 1}`
    };
    setBloodUnits([...bloodUnits, newUnit]);
  };

  const updateBloodUnit = (unit: BloodUnit) => {
    setBloodUnits(bloodUnits.map(u => u.id === unit.id ? unit : u));
  };

  const deleteBloodUnit = (id: string) => {
    setBloodUnits(bloodUnits.filter(unit => unit.id !== id));
  };

  const addDonor = (donor: Omit<BloodDonor, "id">) => {
    const newDonor = {
      ...donor,
      id: `d${donors.length + 1}`
    };
    setDonors([...donors, newDonor]);
  };

  const updateDonor = (donor: BloodDonor) => {
    setDonors(donors.map(d => d.id === donor.id ? donor : d));
  };

  const deleteDonor = (id: string) => {
    setDonors(donors.filter(donor => donor.id !== id));
  };

  const addRequest = (request: Omit<BloodRequest, "id">) => {
    const newRequest = {
      ...request,
      id: `r${requests.length + 1}`
    };
    setRequests([...requests, newRequest]);
  };

  const updateRequest = (request: BloodRequest) => {
    setRequests(requests.map(r => r.id === request.id ? request : r));
  };

  const deleteRequest = (id: string) => {
    setRequests(requests.filter(request => request.id !== id));
  };

  const addCamp = (camp: Omit<BloodDonationCamp, "id">) => {
    const newCamp = {
      ...camp,
      id: `c${camps.length + 1}`
    };
    setCamps([...camps, newCamp]);
  };

  const updateCamp = (camp: BloodDonationCamp) => {
    setCamps(camps.map(c => c.id === camp.id ? camp : c));
  };

  const deleteCamp = (id: string) => {
    setCamps(camps.filter(camp => camp.id !== id));
  };

  const addTransfusion = (transfusion: Omit<BloodTransfusion, "id">) => {
    const newTransfusion = {
      ...transfusion,
      id: `t${transfusions.length + 1}`
    };
    setTransfusions([...transfusions, newTransfusion]);
    
    // Update blood unit status to used
    if (transfusion.status === 'completed') {
      const unit = bloodUnits.find(u => u.id === transfusion.bloodUnitId);
      if (unit) {
        updateBloodUnit({
          ...unit,
          status: 'used'
        });
      }
    }
  };

  const updateTransfusion = (transfusion: BloodTransfusion) => {
    setTransfusions(transfusions.map(t => t.id === transfusion.id ? transfusion : t));
    
    // If status changed to completed, update blood unit status
    if (transfusion.status === 'completed') {
      const unit = bloodUnits.find(u => u.id === transfusion.bloodUnitId);
      if (unit && unit.status !== 'used') {
        updateBloodUnit({
          ...unit,
          status: 'used'
        });
      }
    }
  };

  const deleteTransfusion = (id: string) => {
    setTransfusions(transfusions.filter(t => t.id !== id));
  };

  const addTransfer = (transfer: Omit<BloodStockTransfer, "id">) => {
    const newTransfer = {
      ...transfer,
      id: `tr${transfers.length + 1}`
    };
    setTransfers([...transfers, newTransfer]);
    
    // Update blood unit locations if transfer is completed
    if (transfer.status === 'completed') {
      transfer.units.forEach(item => {
        const unit = bloodUnits.find(u => u.id === item.unitId);
        if (unit) {
          updateBloodUnit({
            ...unit,
            location: transfer.toLocation
          });
        }
      });
    }
  };

  const updateTransfer = (transfer: BloodStockTransfer) => {
    setTransfers(transfers.map(t => t.id === transfer.id ? transfer : t));
    
    // If status changed to completed, update blood unit locations
    if (transfer.status === 'completed') {
      transfer.units.forEach(item => {
        const unit = bloodUnits.find(u => u.id === item.unitId);
        if (unit && unit.location !== transfer.toLocation) {
          updateBloodUnit({
            ...unit,
            location: transfer.toLocation
          });
        }
      });
    }
  };

  const deleteTransfer = (id: string) => {
    setTransfers(transfers.filter(t => t.id !== id));
  };

  const getBloodTypeCompatibility = (bloodType: BloodGroup): BloodGroup[] => {
    const compatibility: Record<BloodGroup, BloodGroup[]> = {
      'O-': ['O-'],
      'O+': ['O-', 'O+'],
      'A-': ['O-', 'A-'],
      'A+': ['O-', 'O+', 'A-', 'A+'],
      'B-': ['O-', 'B-'],
      'B+': ['O-', 'O+', 'B-', 'B+'],
      'AB-': ['O-', 'A-', 'B-', 'AB-'],
      'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
    };
    
    return compatibility[bloodType] || [];
  };

  // Analytics functions
  const getDonorAnalytics = () => {
    const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    return bloodGroups.map(bloodGroup => ({
      bloodGroup,
      count: donors.filter(donor => donor.bloodGroup === bloodGroup).length
    }));
  };

  const getRequestAnalytics = () => {
    const statuses = ['pending', 'fulfilled', 'cancelled'];
    return statuses.map(status => ({
      status,
      count: requests.filter(request => request.status === status).length
    }));
  };

  const getCampPerformance = () => {
    return camps
      .filter(camp => camp.status === 'completed' && camp.actualDonors !== undefined)
      .map(camp => ({
        campName: camp.name,
        donors: camp.actualDonors || 0,
        expected: camp.expectedDonors
      }));
  };

  // Get stock age analysis
  const getStockAgeAnalysis = () => {
    const now = new Date();
    return bloodUnits
      .filter(unit => unit.status === 'available')
      .reduce((acc: Record<string, number>, unit) => {
        const donationDate = new Date(unit.donationDate);
        const ageInDays = Math.floor((now.getTime() - donationDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (ageInDays <= 7) acc['0-7 days'] = (acc['0-7 days'] || 0) + 1;
        else if (ageInDays <= 14) acc['8-14 days'] = (acc['8-14 days'] || 0) + 1;
        else if (ageInDays <= 21) acc['15-21 days'] = (acc['15-21 days'] || 0) + 1;
        else if (ageInDays <= 28) acc['22-28 days'] = (acc['22-28 days'] || 0) + 1;
        else if (ageInDays <= 35) acc['29-35 days'] = (acc['29-35 days'] || 0) + 1;
        else acc['Over 35 days'] = (acc['Over 35 days'] || 0) + 1;
        
        return acc;
      }, {});
  };

  // Get expiring blood units
  const getExpiringUnits = (days: number = 7) => {
    const now = new Date();
    const futureDate = new Date(now);
    futureDate.setDate(futureDate.getDate() + days);
    
    return bloodUnits.filter(unit => {
      if (unit.status !== 'available') return false;
      const expiryDate = new Date(unit.expiryDate);
      return expiryDate > now && expiryDate <= futureDate;
    });
  };

  // Get inventory by location
  const getInventoryByLocation = () => {
    const locations = [...new Set(bloodUnits.map(unit => unit.location))];
    
    return locations.map(location => {
      const units = bloodUnits.filter(unit => unit.location === location);
      const available = units.filter(unit => unit.status === 'available').length;
      const reserved = units.filter(unit => unit.status === 'reserved').length;
      const total = available + reserved;
      
      return {
        location,
        available,
        reserved,
        total
      };
    });
  };

  // Check if compatible blood is available for a specific blood group
  const checkCompatibleBloodAvailability = (bloodGroup: BloodGroup, quantity: number = 1) => {
    const compatibleGroups = getBloodTypeCompatibility(bloodGroup);
    const availableUnits = bloodUnits.filter(unit => 
      unit.status === 'available' && compatibleGroups.includes(unit.bloodGroup)
    );
    
    return {
      available: availableUnits.length >= quantity,
      groups: compatibleGroups.map(group => ({
        bloodGroup: group,
        count: availableUnits.filter(unit => unit.bloodGroup === group).length
      }))
    };
  };

  return {
    bloodUnits,
    donors,
    requests,
    camps,
    transfusions,
    transfers,
    inventory: calculateInventory(),
    addBloodUnit,
    updateBloodUnit,
    deleteBloodUnit,
    addDonor,
    updateDonor,
    deleteDonor,
    addRequest,
    updateRequest,
    deleteRequest,
    addCamp,
    updateCamp,
    deleteCamp,
    addTransfusion,
    updateTransfusion,
    deleteTransfusion,
    addTransfer,
    updateTransfer,
    deleteTransfer,
    getBloodTypeCompatibility,
    getDonorAnalytics,
    getRequestAnalytics,
    getCampPerformance,
    getStockAgeAnalysis,
    getExpiringUnits,
    getInventoryByLocation,
    checkCompatibleBloodAvailability
  };
};
