
// Lab billing types
export type LabBillItem = {
  id: string;
  testName: string;
  price: number;
  quantity: number;
  discount: number;
  category: 'pathology' | 'radiology' | 'other';
  representativeId?: string;
  status?: 'pending' | 'sampling' | 'processing' | 'completed' | 'cancelled';
  estimatedTime?: string;
  sampleDetails?: string; 
  sampleId?: string;
  isHomeCollection?: boolean;
  collectionAddress?: string;
  collectionDateTime?: Date;
  collectionNotes?: string;
};

export type LabCustomer = {
  id: string;
  name: string;
  mobile: string;
  address: string;
  email?: string;
};

// Lab test option type
export interface LabTestOption {
  id: string;
  testName: string;
  price: number;
  category: 'pathology' | 'radiology' | 'other';
  requiresHomeCollection?: boolean;
}

// Lab test representative
export interface LabTestRepresentative {
  id: string;
  name: string;
  role: string;
  specialty?: string;
}

// Lab waitlist patient
export interface LabWaitlistPatient {
  id: string;
  name: string;
  items: number;
  isHighlighted: boolean;
  tests: LabBillItem[];
}

// Lab workflow status tracking
export interface LabWorkflowStep {
  id: string;
  name: string;
  description: string;
  estimatedDuration: number; // in minutes
  requiresSpecialist: boolean;
  specialistRole?: string;
}

export interface LabTestWorkflow {
  testId: string;
  currentStep: number;
  totalSteps: number;
  startedAt: Date;
  estimatedCompletionTime: Date;
  assignedTo?: string;
  notes?: string[];
}

// Home collection specific types
export interface HomeCollectionDetails {
  address: string;
  scheduledDate: Date;
  contactNumber: string;
  specialInstructions?: string;
  collectorId?: string;
  collectionStatus: 'scheduled' | 'in-progress' | 'completed' | 'failed';
}
