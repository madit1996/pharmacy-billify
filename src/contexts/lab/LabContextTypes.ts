
import { LabTest, LabTestStatus, WorkflowHistoryItem } from "@/types/lab-tests";
import { LabBillItem, LabCustomer, LabTestOption, LabTestRepresentative, LabWaitlistPatient } from "@/types/lab-types";

export interface MultiPatientBill {
  patientCount: number;
  testCount: number;
}

export interface LabContextType {
  pendingTests: LabTest[];
  completedTests: LabTest[];
  selectedTest: LabTest | null;
  billItems: LabBillItem[];
  selectedCustomer: LabCustomer | null;
  searchTerm: string;
  handleSelectTest: (test: LabTest) => void;
  handleUploadResult: (testId: string, resultFile: File) => void;
  handleCreateReport: (testId: string, reportData: Record<string, any>) => void;
  addItemToBill: (item: LabBillItem) => void;
  updateItemQuantity: (id: string, change: number) => void;
  removeItem: (id: string) => void;
  calculateSubtotal: () => number;
  handleSearchCustomer: (term: string) => void;
  handleAddNewCustomer: () => void;
  handleSelectCustomer: (customer: LabCustomer) => void;
  handlePrintBill: () => void;
  labTestOptions: LabTestOption[];
  customers: LabCustomer[];
  handleEditCustomer: () => void;
  handleSaveCustomer: (customer: LabCustomer) => void;
  isEditingCustomer: boolean;
  setIsEditingCustomer: (isEditing: boolean) => void;
  multiPatientBill?: MultiPatientBill;
  assignTestToRepresentative: (testId: string, representativeId: string) => void;
  waitlistPatients: LabWaitlistPatient[];
  handleSelectWaitlistPatient: (patient: LabWaitlistPatient) => void;
  updateTestStatus: (testId: string, status: string, estimatedTime?: string) => void;
  updateTestWorkflow: (
    testId: string, 
    newStatus: string, 
    notes?: string, 
    additionalInfo?: Partial<WorkflowHistoryItem>
  ) => void;
  updateSampleDetails: (testId: string, sampleDetails: string, sampleId?: string) => void;
}
