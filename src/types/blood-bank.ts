
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface BloodUnit {
  id: string;
  bloodGroup: BloodGroup;
  donationDate: string;
  expiryDate: string;
  volume: number; // in ml
  donorId?: string;
  status: 'available' | 'reserved' | 'used' | 'expired';
  location: string;
  campId?: string;
  crossMatchTested?: boolean;
  testedBy?: string;
  labReportId?: string;
}

export interface BloodDonor {
  id: string;
  name: string;
  contactNumber: string;
  email?: string;
  bloodGroup: BloodGroup;
  lastDonationDate?: string;
  medicalHistory?: string;
  donationCount: number;
  eligibleDate?: string; // Next date when donor is eligible for donation
  haemoglobin?: number; // Haemoglobin level in g/dL
  weight?: number; // Weight in kg
  lastScreeningResult?: 'pass' | 'temporary-deferral' | 'permanent-deferral';
  deferralReason?: string;
}

export interface BloodRequest {
  id: string;
  patientId: string;
  patientName: string;
  bloodGroup: BloodGroup;
  quantity: number;
  requestDate: string;
  requiredDate: string;
  status: 'pending' | 'fulfilled' | 'cancelled';
  priority: 'normal' | 'urgent' | 'emergency';
  requestedBy: string;
  purpose: string;
  crossMatchRequired?: boolean;
  issuedUnits?: string[]; // Array of blood unit IDs issued for this request
}

export interface BloodInventorySummary {
  bloodGroup: BloodGroup;
  available: number;
  reserved: number;
  total: number;
  lastUpdated?: string;
  criticalLevel?: number; // Minimum threshold for critical alert
  lowLevel?: number; // Threshold for low stock alert
}

export interface BloodDonationCamp {
  id: string;
  name: string;
  location: string;
  address: string;
  organizer: string;
  contactPerson: string;
  contactNumber: string;
  startDate: string;
  endDate: string;
  expectedDonors: number;
  actualDonors?: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  notes?: string;
  collectedUnits?: number; // Total blood units collected in the camp
}

export interface BloodTransfusion {
  id: string;
  patientId: string;
  patientName: string;
  bloodUnitId: string;
  bloodGroup: BloodGroup;
  transfusionDate: string;
  administeredBy: string;
  transfusionStartTime: string;
  transfusionEndTime?: string;
  vitalsBefore: VitalSigns;
  vitalsAfter?: VitalSigns;
  reactions?: TransfusionReaction[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
}

export interface VitalSigns {
  temperature: number; // in Celsius
  heartRate: number; // beats per minute
  bloodPressure: string; // e.g. "120/80"
  respiratoryRate: number; // breaths per minute
  oxygenSaturation: number; // percentage
}

export interface TransfusionReaction {
  type: 'mild' | 'moderate' | 'severe' | 'none';
  symptoms: string[];
  timeObserved: string;
  actionTaken: string;
  reportedBy: string;
}

export interface BloodStockTransfer {
  id: string;
  fromLocation: string;
  toLocation: string;
  units: {
    unitId: string;
    bloodGroup: BloodGroup;
  }[];
  transferDate: string;
  requestedBy: string;
  approvedBy?: string;
  status: 'requested' | 'approved' | 'in-transit' | 'completed' | 'cancelled';
  notes?: string;
}
