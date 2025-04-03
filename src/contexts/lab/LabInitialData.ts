
import { LabTest, LabTestStatus } from "@/types/lab-tests";
import { LabBillItem, LabCustomer, LabTestOption, LabWaitlistPatient } from "@/types/lab-types";

// Initial pending tests data
export const initialPendingTests: LabTest[] = [
  { 
    id: "LT001", 
    patientName: "John Doe", 
    patientId: "P001", 
    testName: "Complete Blood Count", 
    status: "sampling" as LabTestStatus, 
    orderedDate: new Date(2023, 7, 15),
    doctorName: "Dr. Sarah Smith",
    category: "pathology",
    sampleDetails: "Blood sample - 5ml",
    sampleId: "S001-CBC",
    estimatedCompletionTime: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours from now
    workflowHistory: [
      {
        fromStatus: "pending" as LabTestStatus,
        toStatus: "sampling" as LabTestStatus,
        timestamp: new Date(2023, 7, 15),
        notes: "Sample collection scheduled"
      }
    ]
  },
  { 
    id: "LT002", 
    patientName: "Jane Smith", 
    patientId: "P002", 
    testName: "Lipid Profile", 
    status: "processing" as LabTestStatus, 
    orderedDate: new Date(2023, 7, 16),
    doctorName: "Dr. Robert Johnson",
    category: "pathology",
    sampleDetails: "Blood sample - 10ml (fasting)",
    sampleId: "S002-LP",
    estimatedCompletionTime: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours from now
    workflowHistory: [
      {
        fromStatus: "pending" as LabTestStatus,
        toStatus: "sampling" as LabTestStatus,
        timestamp: new Date(2023, 7, 16, 9, 0),
        notes: "Sample collected"
      },
      {
        fromStatus: "sampling" as LabTestStatus,
        toStatus: "processing" as LabTestStatus,
        timestamp: new Date(2023, 7, 16, 10, 0),
        notes: "Sample sent to lab for processing"
      }
    ]
  },
  { 
    id: "LT003", 
    patientName: "Alex Brown", 
    patientId: "P003", 
    testName: "Thyroid Function Test", 
    status: "reporting" as LabTestStatus, 
    orderedDate: new Date(2023, 7, 16),
    doctorName: "Dr. Emily Williams",
    category: "pathology",
    sampleDetails: "Blood sample - 5ml",
    sampleId: "S003-TFT",
    estimatedCompletionTime: new Date(Date.now() + 1000 * 60 * 60 * 1), // 1 hour from now
    workflowHistory: [
      {
        fromStatus: "pending" as LabTestStatus,
        toStatus: "sampling" as LabTestStatus,
        timestamp: new Date(2023, 7, 16, 8, 30),
        notes: "Sample collected"
      },
      {
        fromStatus: "sampling" as LabTestStatus,
        toStatus: "processing" as LabTestStatus,
        timestamp: new Date(2023, 7, 16, 9, 15),
        notes: "Sample processing"
      },
      {
        fromStatus: "processing" as LabTestStatus,
        toStatus: "reporting" as LabTestStatus,
        timestamp: new Date(2023, 7, 16, 14, 0),
        notes: "Processing complete, report preparation"
      }
    ]
  },
  { 
    id: "LT004", 
    patientName: "Maria Garcia", 
    patientId: "P004", 
    testName: "Blood Glucose", 
    status: "sampling" as LabTestStatus, 
    orderedDate: new Date(2023, 7, 17),
    doctorName: "Dr. Michael Davis",
    category: "pathology",
    sampleDetails: "Blood sample - 3ml",
    sampleId: "S004-BG",
    estimatedCompletionTime: new Date(Date.now() + 1000 * 60 * 60 * 2), // 2 hours from now
    workflowHistory: [
      {
        fromStatus: "pending" as LabTestStatus,
        toStatus: "sampling" as LabTestStatus,
        timestamp: new Date(2023, 7, 17, 10, 0),
        notes: "Sample collection in progress"
      }
    ]
  },
  { 
    id: "LT005", 
    patientName: "Robert Wilson", 
    patientId: "P005", 
    testName: "Liver Function Test", 
    status: "processing" as LabTestStatus, 
    orderedDate: new Date(2023, 7, 17),
    doctorName: "Dr. Sarah Smith",
    category: "pathology",
    sampleDetails: "Blood sample - 7ml",
    sampleId: "S005-LFT",
    estimatedCompletionTime: new Date(Date.now() + 1000 * 60 * 60 * 4), // 4 hours from now
    workflowHistory: [
      {
        fromStatus: "pending" as LabTestStatus,
        toStatus: "sampling" as LabTestStatus,
        timestamp: new Date(2023, 7, 17, 9, 0),
        notes: "Sample collected"
      },
      {
        fromStatus: "sampling" as LabTestStatus,
        toStatus: "processing" as LabTestStatus,
        timestamp: new Date(2023, 7, 17, 11, 0),
        notes: "Processing in lab"
      }
    ]
  },
  { 
    id: "LT006", 
    patientName: "William Moore", 
    patientId: "P006", 
    testName: "X-Ray Chest", 
    status: "reporting" as LabTestStatus, 
    orderedDate: new Date(2023, 7, 18),
    doctorName: "Dr. James Wilson",
    category: "radiology",
    sampleDetails: "PA view X-ray",
    sampleId: "S006-XR",
    estimatedCompletionTime: new Date(Date.now() + 1000 * 60 * 30), // 30 minutes from now
    workflowHistory: [
      {
        fromStatus: "pending" as LabTestStatus,
        toStatus: "sampling" as LabTestStatus,
        timestamp: new Date(2023, 7, 18, 10, 0),
        notes: "Patient prepped for imaging"
      },
      {
        fromStatus: "sampling" as LabTestStatus,
        toStatus: "processing" as LabTestStatus,
        timestamp: new Date(2023, 7, 18, 10, 15),
        notes: "Imaging completed"
      },
      {
        fromStatus: "processing" as LabTestStatus,
        toStatus: "reporting" as LabTestStatus,
        timestamp: new Date(2023, 7, 18, 11, 0),
        notes: "Images processed, report in preparation"
      }
    ]
  },
  { 
    id: "LT007", 
    patientName: "Susan Taylor", 
    patientId: "P007", 
    testName: "MRI Brain", 
    status: "sampling" as LabTestStatus, 
    orderedDate: new Date(2023, 7, 18),
    doctorName: "Dr. Patricia Johnson",
    category: "radiology",
    sampleDetails: "Full brain scan with contrast",
    sampleId: "S007-MRI",
    estimatedCompletionTime: new Date(Date.now() + 1000 * 60 * 60 * 5), // 5 hours from now
    workflowHistory: [
      {
        fromStatus: "pending" as LabTestStatus,
        toStatus: "sampling" as LabTestStatus,
        timestamp: new Date(2023, 7, 18, 13, 0),
        notes: "Patient prepped for MRI"
      }
    ]
  }
];

// Initial completed tests data
export const initialCompletedTests: LabTest[] = [
  { 
    id: "LT008", 
    patientName: "David Lee", 
    patientId: "P008", 
    testName: "Complete Blood Count", 
    status: "completed" as LabTestStatus, 
    orderedDate: new Date(2023, 7, 14),
    completedDate: new Date(2023, 7, 15),
    resultUrl: "https://example.com/results/LT006.pdf",
    doctorName: "Dr. Robert Johnson",
    category: "pathology",
    price: 25
  },
  { 
    id: "LT009", 
    patientName: "Lucy Chen", 
    patientId: "P009", 
    testName: "Urine Analysis", 
    status: "completed" as LabTestStatus, 
    orderedDate: new Date(2023, 7, 13),
    completedDate: new Date(2023, 7, 14),
    resultUrl: "https://example.com/results/LT007.pdf",
    doctorName: "Dr. Emily Williams",
    category: "pathology",
    price: 20
  },
  { 
    id: "LT010", 
    patientName: "Thomas Johnson", 
    patientId: "P010", 
    testName: "CT Scan Head", 
    status: "completed" as LabTestStatus, 
    orderedDate: new Date(2023, 7, 12),
    completedDate: new Date(2023, 7, 13),
    resultUrl: "https://example.com/results/LT010.pdf",
    doctorName: "Dr. James Wilson",
    category: "radiology",
    price: 250
  },
  { 
    id: "LT011", 
    patientName: "Laura Rodriguez", 
    patientId: "P011", 
    testName: "Ultrasound Abdomen", 
    status: "completed" as LabTestStatus, 
    orderedDate: new Date(2023, 7, 11),
    completedDate: new Date(2023, 7, 12),
    resultUrl: "https://example.com/results/LT011.pdf",
    doctorName: "Dr. Patricia Johnson",
    category: "radiology",
    price: 80
  }
];

// Lab test options data
export const labTestOptions: LabTestOption[] = [
  { id: "LT101", testName: "Complete Blood Count (CBC)", price: 25.00, category: 'pathology' as const },
  { id: "LT102", testName: "Lipid Profile", price: 35.00, category: 'pathology' as const },
  { id: "LT103", testName: "Thyroid Function Test", price: 45.00, category: 'pathology' as const },
  { id: "LT104", testName: "Liver Function Test", price: 40.00, category: 'pathology' as const },
  { id: "LT105", testName: "Kidney Function Test", price: 42.00, category: 'pathology' as const },
  { id: "LT106", testName: "HbA1c", price: 30.00, category: 'pathology' as const },
  { id: "LT107", testName: "X-Ray Chest", price: 60.00, category: 'radiology' as const },
  { id: "LT108", testName: "Ultrasound Abdomen", price: 80.00, category: 'radiology' as const },
  { id: "LT109", testName: "CT Scan Head", price: 250.00, category: 'radiology' as const },
  { id: "LT110", testName: "MRI Brain", price: 350.00, category: 'radiology' as const },
];

// Customer data
export const initialCustomers: LabCustomer[] = [
  { id: "C1", name: "John Smith", mobile: "+1-555-123-4567", address: "123 Main St, Anytown" },
  { id: "C2", name: "Sarah Johnson", mobile: "+1-555-987-6543", address: "456 Oak Ave, Somewhere" },
  { id: "C3", name: "Michael Brown", mobile: "+1-555-456-7890", address: "789 Pine Rd, Nowhere" },
  { id: "C4", name: "Emily Davis", mobile: "+1-555-789-0123", address: "101 Maple Dr, Anywhere" }
];

// Waitlist patients data
export const initialWaitlistPatients: LabWaitlistPatient[] = [
  {
    id: "WP001",
    name: "David Lee",
    items: 3,
    isHighlighted: true,
    tests: [
      { id: "LT101", testName: "Complete Blood Count (CBC)", price: 25.00, quantity: 1, discount: 0, category: 'pathology' },
      { id: "LT103", testName: "Thyroid Function Test", price: 45.00, quantity: 1, discount: 0, category: 'pathology' },
      { id: "LT105", testName: "Kidney Function Test", price: 42.00, quantity: 1, discount: 0, category: 'pathology' }
    ]
  },
  {
    id: "WP002",
    name: "Sarah Johnson",
    items: 2,
    isHighlighted: false,
    tests: [
      { id: "LT104", testName: "Liver Function Test", price: 40.00, quantity: 1, discount: 0, category: 'pathology' },
      { id: "LT107", testName: "X-Ray Chest", price: 60.00, quantity: 1, discount: 0, category: 'radiology' }
    ]
  },
  {
    id: "WP003",
    name: "Michael Brown",
    items: 1,
    isHighlighted: false,
    tests: [
      { id: "LT110", testName: "MRI Brain", price: 350.00, quantity: 1, discount: 0, category: 'radiology' }
    ]
  }
];

// Representatives data
export const labRepresentatives = [
  { id: "R1", name: "Dr. Sarah Smith", role: "Lab Technician" },
  { id: "R2", name: "Dr. Robert Johnson", role: "Pathologist" },
  { id: "R3", name: "Dr. Emily Williams", role: "Radiologist" },
  { id: "R4", name: "John Miller", role: "Lab Assistant" }
];
