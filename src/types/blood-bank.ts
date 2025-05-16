
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
}

export interface BloodInventorySummary {
  bloodGroup: BloodGroup;
  available: number;
  reserved: number;
  total: number;
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
}
