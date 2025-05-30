
// Lab test data types
export type LabTestStatus = 'pending' | 'sampling' | 'processing' | 'reporting' | 'completed' | 'cancelled';

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
  isHomeCollection?: boolean; // Flag for home collection
  collectionAddress?: string; // Address for home collection
  collectionDateTime?: Date; // When the collection is scheduled
  collectionNotes?: string; // Any notes for collection
  collectionRepresentativeId?: string; // Who will collect the sample
}

// Track workflow history with enhanced representative tracking
export interface WorkflowHistoryItem {
  fromStatus: LabTestStatus;
  toStatus: LabTestStatus;
  timestamp: Date;
  performedBy?: string; // ID of the representative who performed this step
  performerName?: string; // Name of the representative who performed this step
  notes?: string;
  sampleDetails?: string; // Details specific to sample collection
  processingDetails?: string; // Details specific to processing
  reportingDetails?: string; // Details specific to reporting
  collectionDetails?: string; // Details specific to home collection
}
