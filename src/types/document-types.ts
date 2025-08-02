export type DocumentType = 
  | 'prescription' 
  | 'lab-report' 
  | 'radiology-report' 
  | 'opd-notes' 
  | 'vaccination-record' 
  | 'discharge-summary' 
  | 'medical-certificate' 
  | 'invoice' 
  | 'consent-form'
  | 'test-request';

export type DocumentStatus = 'draft' | 'generated' | 'signed' | 'delivered';

export interface Document {
  id: string;
  type: DocumentType;
  title: string;
  description?: string;
  patientId: string;
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  department: string;
  createdAt: Date;
  updatedAt: Date;
  status: DocumentStatus;
  fileUrl?: string;
  content?: Record<string, any>;
  referenceNumber: string; // PER1, LAB2, DSC1, etc.
  metadata?: {
    version?: number;
    originalDocumentId?: string;
    signedBy?: string;
    signedAt?: Date;
    tags?: string[];
  };
}

export interface AppointmentDocumentSummary {
  appointmentId: string;
  patientName: string;
  appointmentDate: Date;
  doctorName: string;
  duration: number; // in minutes
  documents: Document[];
  totalDocuments: number;
  prescriptions: Document[];
  labRequests: Document[];
  radiologyOrders: Document[];
  opdNotes: Document[];
  invoices: Document[];
  vaccinations: Document[];
  dischargeSummaries: Document[];
  internalNotes?: string[];
}

export interface DocumentFilter {
  type?: DocumentType[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  appointmentId?: string;
  department?: string;
  doctorName?: string;
  status?: DocumentStatus[];
  searchTerm?: string;
}

export interface DocumentGenerationRequest {
  type: DocumentType;
  patientId: string;
  appointmentId: string;
  doctorId: string;
  content: Record<string, any>;
  templateId?: string;
}