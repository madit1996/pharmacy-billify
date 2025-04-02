
// Lab test data types
export type LabTestStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled';

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
  billId?: string; // Added to group tests from the same bill
}
