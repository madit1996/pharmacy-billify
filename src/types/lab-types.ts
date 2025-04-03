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
  sampleDetails?: string; // Added this property
  sampleId?: string;     // Added this property
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
