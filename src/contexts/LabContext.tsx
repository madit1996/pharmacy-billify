import { createContext, useState, useContext, ReactNode } from "react";
import { LabTest, LabTestStatus, WorkflowHistoryItem } from "@/types/lab-tests";
import { LabBillItem, LabCustomer, LabTestOption, LabTestRepresentative, LabWaitlistPatient } from "@/types/lab-types";
import { useToast } from "@/hooks/use-toast";

interface MultiPatientBill {
  patientCount: number;
  testCount: number;
}

interface LabContextType {
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
  updateTestWorkflow: (testId: string, newStatus: string, notes?: string) => void;
  updateSampleDetails: (testId: string, sampleDetails: string, sampleId?: string) => void;
}

const LabContext = createContext<LabContextType | undefined>(undefined);

export const initialPendingTests: LabTest[] = [
  { 
    id: "LT001", 
    patientName: "John Doe", 
    patientId: "P001", 
    testName: "Complete Blood Count", 
    status: "sampling", 
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
    status: "processing", 
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
    status: "reporting", 
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
    status: "sampling", 
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
    status: "processing", 
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
    status: "reporting", 
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
    status: "sampling", 
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

export const initialCompletedTests: LabTest[] = [
  { 
    id: "LT008", 
    patientName: "David Lee", 
    patientId: "P008", 
    testName: "Complete Blood Count", 
    status: "completed", 
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
    status: "completed", 
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
    status: "completed", 
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
    status: "completed", 
    orderedDate: new Date(2023, 7, 11),
    completedDate: new Date(2023, 7, 12),
    resultUrl: "https://example.com/results/LT011.pdf",
    doctorName: "Dr. Patricia Johnson",
    category: "radiology",
    price: 80
  }
];

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

export const customers: LabCustomer[] = [
  { id: "C1", name: "John Smith", mobile: "+1-555-123-4567", address: "123 Main St, Anytown" },
  { id: "C2", name: "Sarah Johnson", mobile: "+1-555-987-6543", address: "456 Oak Ave, Somewhere" },
  { id: "C3", name: "Michael Brown", mobile: "+1-555-456-7890", address: "789 Pine Rd, Nowhere" },
  { id: "C4", name: "Emily Davis", mobile: "+1-555-789-0123", address: "101 Maple Dr, Anywhere" }
];

const initialWaitlistPatients: LabWaitlistPatient[] = [
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

export const LabProvider = ({ children }: { children: ReactNode }) => {
  const [pendingTests, setPendingTests] = useState<LabTest[]>(initialPendingTests);
  const [completedTests, setCompletedTests] = useState<LabTest[]>(initialCompletedTests);
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [billItems, setBillItems] = useState<LabBillItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<LabCustomer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [customersState, setCustomersState] = useState<LabCustomer[]>(customers);
  const [waitlistPatients, setWaitlistPatients] = useState<LabWaitlistPatient[]>(initialWaitlistPatients);
  const { toast } = useToast();

  const handleSelectTest = (test: LabTest) => {
    setSelectedTest(test);
  };

  const handleUploadResult = (testId: string, resultFile: File) => {
    const testToUpdate = pendingTests.find(test => test.id === testId);
    
    if (!testToUpdate) return;
    
    const fakeResultUrl = `https://example.com/results/${testId}.pdf`;
    
    const updatedTest: LabTest = {
      ...testToUpdate,
      status: "completed",
      completedDate: new Date(),
      resultUrl: fakeResultUrl
    };
    
    const updatedPendingTests = pendingTests.filter(test => test.id !== testId);
    setPendingTests(updatedPendingTests);
    
    setCompletedTests([...completedTests, updatedTest]);
    
    setSelectedTest(null);
    
    toast({
      title: "Test result uploaded",
      description: `Result for ${testToUpdate.testName} has been uploaded successfully.`,
    });
  };

  const handleCreateReport = (testId: string, reportData: Record<string, any>) => {
    const testToUpdate = pendingTests.find(test => test.id === testId);
    
    if (!testToUpdate) return;
    
    const fakeResultUrl = `https://example.com/reports/${testId}.pdf`;
    
    const updatedTest: LabTest = {
      ...testToUpdate,
      status: "completed",
      completedDate: new Date(),
      resultUrl: fakeResultUrl,
      notes: JSON.stringify(reportData)
    };
    
    const updatedPendingTests = pendingTests.filter(test => test.id !== testId);
    setPendingTests(updatedPendingTests);
    
    setCompletedTests([...completedTests, updatedTest]);
    
    setSelectedTest(null);
    
    toast({
      title: "Test report created",
      description: `Report for ${testToUpdate.testName} has been created successfully.`,
    });
  };

  const addItemToBill = (item: LabBillItem) => {
    const existingItemIndex = billItems.findIndex((i) => i.id === item.id);
    
    if (existingItemIndex !== -1) {
      const updatedItems = [...billItems];
      updatedItems[existingItemIndex].quantity += 1;
      setBillItems(updatedItems);
    } else {
      setBillItems([...billItems, item]);
    }
    
    toast({
      title: "Added to bill",
      description: `${item.testName} has been added to the bill`,
    });
  };

  const updateItemQuantity = (id: string, change: number) => {
    const updatedItems = billItems.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setBillItems(updatedItems);
  };

  const removeItem = (id: string) => {
    setBillItems(billItems.filter((item) => item.id !== id));
  };

  const calculateSubtotal = () => {
    return billItems.reduce((sum, item) => {
      return sum + item.price * item.quantity * (1 - item.discount / 100);
    }, 0);
  };

  const handleSearchCustomer = (term: string) => {
    setSearchTerm(term);
    
    const matchedCustomer = customersState.find(
      c => c.name.toLowerCase() === term.toLowerCase()
    );
    
    if (matchedCustomer) {
      setSelectedCustomer(matchedCustomer);
    } else if (selectedCustomer && term.length === 0) {
      setSelectedCustomer(null);
    }
  };

  const handleAddNewCustomer = () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Invalid input",
        description: "Please enter a name to add a new customer",
        variant: "destructive"
      });
      return;
    }
    
    const existingCustomer = customersState.find(c => 
      c.name.toLowerCase() === searchTerm.toLowerCase()
    );
    
    if (existingCustomer) {
      setSelectedCustomer(existingCustomer);
      toast({
        title: "Customer selected",
        description: `${existingCustomer.name} is already in the system`,
      });
      return;
    }
    
    const newCustomer = {
      id: `C${customersState.length + 1}`,
      name: searchTerm,
      mobile: "New customer",
      address: "Please update address"
    };
    
    setSelectedCustomer(newCustomer);
    setIsEditingCustomer(true);
    
    toast({
      title: "New patient added",
      description: "Please update patient details",
    });
  };

  const handleEditCustomer = () => {
    if (selectedCustomer) {
      setIsEditingCustomer(true);
    }
  };

  const handleSaveCustomer = (customer: LabCustomer) => {
    const customerIndex = customersState.findIndex(c => c.id === customer.id);
    
    if (customerIndex !== -1) {
      const updatedCustomers = [...customersState];
      updatedCustomers[customerIndex] = customer;
      setCustomersState(updatedCustomers);
    } else {
      setCustomersState([...customersState, customer]);
    }
    
    setSelectedCustomer(customer);
    setIsEditingCustomer(false);
    
    toast({
      title: "Patient saved",
      description: "Patient details have been updated successfully",
    });
  };

  const handleSelectCustomer = (customer: LabCustomer) => {
    setSelectedCustomer(customer);
    setSearchTerm(customer.name);
  };

  const assignTestToRepresentative = (testId: string, representativeId: string) => {
    const updatedBillItems = billItems.map(item => {
      if (item.id === testId) {
        return { ...item, representativeId };
      }
      return item;
    });
    
    setBillItems(updatedBillItems);
    
    toast({
      title: "Test assigned",
      description: `Test has been assigned to representative ID: ${representativeId}`,
    });
  };

  const handleSelectWaitlistPatient = (patient: LabWaitlistPatient) => {
    setBillItems(patient.tests);
    
    const matchingCustomer = customersState.find(c => c.name === patient.name);
    
    if (matchingCustomer) {
      setSelectedCustomer(matchingCustomer);
      setSearchTerm(matchingCustomer.name);
    } else {
      const newCustomer = {
        id: patient.id,
        name: patient.name,
        mobile: "Unknown",
        address: "Unknown"
      };
      setSelectedCustomer(newCustomer);
      setSearchTerm(newCustomer.name);
    }
    
    toast({
      title: "Patient loaded",
      description: `${patient.name}'s recommended tests loaded`,
    });
    
    const updatedWaitlist = waitlistPatients.map(p => ({
      ...p,
      isHighlighted: p.id === patient.id
    }));
    
    setWaitlistPatients(updatedWaitlist);
  };

  const updateTestStatus = (testId: string, status: string, estimatedTime?: string) => {
    const updatedBillItems = billItems.map(item => {
      if (item.id === testId) {
        return { 
          ...item, 
          status: status as 'pending' | 'sampling' | 'processing' | 'completed' | 'cancelled',
          estimatedTime
        };
      }
      return item;
    });
    
    setBillItems(updatedBillItems);
    
    toast({
      title: "Test status updated",
      description: `Test status updated to ${status}`,
    });
  };

  const updateTestWorkflow = (testId: string, newStatus: string, notes?: string) => {
    const pendingTestIndex = pendingTests.findIndex(test => test.id === testId);
    
    if (pendingTestIndex !== -1) {
      const updatedPendingTests = [...pendingTests];
      const test = updatedPendingTests[pendingTestIndex];
      
      const historyItem: WorkflowHistoryItem = {
        fromStatus: test.status,
        toStatus: newStatus as LabTestStatus,
        timestamp: new Date(),
        notes: notes
      };
      
      const updatedTest = {
        ...test,
        status: newStatus as LabTestStatus,
        workflowHistory: [
          ...(test.workflowHistory || []),
          historyItem
        ]
      };
      
      if (newStatus === 'completed' && !updatedTest.completedDate) {
        updatedTest.completedDate = new Date();
        
        setCompletedTests([...completedTests, updatedTest]);
        updatedPendingTests.splice(pendingTestIndex, 1);
        setPendingTests(updatedPendingTests);
      } else if (newStatus !== 'completed') {
        updatedPendingTests[pendingTestIndex] = updatedTest;
        setPendingTests(updatedPendingTests);
      }
      
      toast({
        title: "Test status updated",
        description: `Test ${test.testName} status updated to ${newStatus}`,
      });
      
      return;
    }
    
    const completedTestIndex = completedTests.findIndex(test => test.id === testId);
    
    if (completedTestIndex !== -1) {
      const updatedCompletedTests = [...completedTests];
      const test = updatedCompletedTests[completedTestIndex];
      
      const historyItem: WorkflowHistoryItem = {
        fromStatus: test.status,
        toStatus: newStatus as LabTestStatus,
        timestamp: new Date(),
        notes: notes
      };
      
      if (newStatus !== 'completed') {
        const updatedTest = {
          ...test,
          status: newStatus as LabTestStatus,
          completedDate: undefined,
          workflowHistory: [
            ...(test.workflowHistory || []),
            historyItem
          ]
        };
        
        setPendingTests([...pendingTests, updatedTest]);
        updatedCompletedTests.splice(completedTestIndex, 1);
        setCompletedTests(updatedCompletedTests);
      } else {
        updatedCompletedTests[completedTestIndex] = {
          ...test,
          workflowHistory: [
            ...(test.workflowHistory || []),
            historyItem
          ]
        };
        setCompletedTests(updatedCompletedTests);
      }
      
      toast({
        title: "Test status updated",
        description: `Test ${test.testName} status updated to ${newStatus}`,
      });
    }
  };

  const updateSampleDetails = (testId: string, sampleDetails: string, sampleId?: string) => {
    const pendingTestIndex = pendingTests.findIndex(test => test.id === testId);
    
    if (pendingTestIndex !== -1) {
      const updatedPendingTests = [...pendingTests];
      updatedPendingTests[pendingTestIndex] = {
        ...updatedPendingTests[pendingTestIndex],
        sampleDetails,
        sampleId
      };
      setPendingTests(updatedPendingTests);
      
      toast({
        title: "Sample details updated",
        description: `Sample information updated for ${updatedPendingTests[pendingTestIndex].testName}`,
      });
    }
  };

  const handlePrintBill = () => {
    if (billItems.length === 0) {
      toast({
        title: "No items in bill",
        description: "Please add items to the bill before printing",
        variant: "destructive"
      });
      return;
    }

    if (!selectedCustomer) {
      toast({
        title: "No patient selected",
        description: "Please select a patient before printing the bill",
        variant: "destructive"
      });
      return;
    }

    const billId = `BILL-${Date.now()}`;
    
    const newPendingTests: LabTest[] = billItems.map((item, index) => ({
      id: `LT${Date.now()}-${index}`,
      patientName: selectedCustomer.name,
      patientId: selectedCustomer.id,
      testName: item.testName,
      status: 'sampling' as LabTestStatus,
      orderedDate: new Date(),
      doctorName: item.representativeId ? `Rep ID: ${item.representativeId}` : "Self-Order",
      category: item.category,
      billId: billId,
      price: item.price,
      representativeId: item.representativeId,
      sampleDetails: item.sampleDetails,
      sampleId: item.sampleId,
      workflowHistory: [{
        fromStatus: 'sampling' as LabTestStatus,
        toStatus: 'sampling' as LabTestStatus,
        timestamp: new Date(),
        notes: 'Initial status'
      }]
    }));

    setPendingTests([...pendingTests, ...newPendingTests]);
    
    setBillItems([]);
    setSelectedCustomer(null);
    setSearchTerm("");
    
    if (selectedCustomer) {
      const updatedWaitlist = waitlistPatients.filter(
        p => p.name.toLowerCase() !== selectedCustomer.name.toLowerCase()
      );
      setWaitlistPatients(updatedWaitlist);
    }
    
    toast({
      title: "Bill generated",
      description: `Bill #${billId} created with ${newPendingTests.length} test(s)`,
    });
  };

  return (
    <LabContext.Provider
      value={{
        pendingTests,
        completedTests,
        selectedTest,
        billItems,
        selectedCustomer,
        searchTerm,
        handleSelectTest,
        handleUploadResult,
        handleCreateReport,
        addItemToBill,
        updateItemQuantity,
        removeItem,
        calculateSubtotal,
        handleSearchCustomer,
        handleAddNewCustomer,
        handleSelectCustomer,
        handlePrintBill,
        labTestOptions,
        customers: customersState,
        handleEditCustomer,
        handleSaveCustomer,
        isEditingCustomer,
        setIsEditingCustomer,
        assignTestToRepresentative,
        waitlistPatients,
        handleSelectWaitlistPatient,
        updateTestStatus,
        updateTestWorkflow,
        updateSampleDetails,
      }}
    >
      {children}
    </LabContext.Provider>
  );
};

export const useLabContext = () => {
  const context = useContext(LabContext);
  if (context === undefined) {
    throw new Error("useLabContext must be used within a LabProvider");
  }
  return context;
};
