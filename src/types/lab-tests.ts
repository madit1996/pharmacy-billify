
// Lab test data types
export type LabTestStatus = 'sampling' | 'processing' | 'reporting' | 'completed' | 'cancelled' | 'pending';

export interface LabTest {
  id: string;
  patientName: string;
  patientId: string;
  testName: string;
  status: LabTestStatus;
  orderedDate: Date;
  completedDate?: Date;
  resultUrl?: string;
  doctorName: string;
  notes?: string;
  price?: number;
  category?: 'pathology' | 'radiology' | 'other';
  paymentStatus?: 'paid' | 'pending' | 'refunded';
  billId?: string; // Bill ID to group tests from the same bill
  referralId?: string; // Added to track referrals
  sampleDetails?: string; // Information about samples collected
  estimatedCompletionTime?: Date; // Estimated time for test completion
  sampleId?: string; // Sample identifier
  representativeId?: string; // ID of assigned lab representative
  workflowHistory?: WorkflowHistoryItem[]; // Track status changes
}

// Track workflow history
export interface WorkflowHistoryItem {
  fromStatus: LabTestStatus;
  toStatus: LabTestStatus;
  timestamp: Date;
  performedBy?: string;
  notes?: string;
}
