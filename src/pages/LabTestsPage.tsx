import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { LabTest } from "@/types/lab-tests";
import LabMetricsPanel from "@/components/lab/LabMetricsPanel";
import LabBillingPanel from "@/components/lab/LabBillingPanel";
import LabSearchPanel from "@/components/lab/LabSearchPanel";
import PendingTestsList from "@/components/lab/PendingTestsList";
import CompletedTestsList from "@/components/lab/CompletedTestsList";
import UploadTestResultForm from "@/components/lab/UploadTestResultForm";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

export type LabBillItem = {
  id: string;
  testName: string;
  price: number;
  quantity: number;
  discount: number;
  category: 'pathology' | 'radiology' | 'other';
};

export type LabCustomer = {
  id: string;
  name: string;
  mobile: string;
  address: string;
  email?: string;
};

const LabTestsPage = () => {
  const [pendingTests, setPendingTests] = useState<LabTest[]>([
    { 
      id: "LT001", 
      patientName: "John Doe", 
      patientId: "P001", 
      testName: "Complete Blood Count", 
      status: "pending", 
      orderedDate: new Date(2023, 7, 15),
      doctorName: "Dr. Sarah Smith"
    },
    { 
      id: "LT002", 
      patientName: "Jane Smith", 
      patientId: "P002", 
      testName: "Lipid Profile", 
      status: "pending", 
      orderedDate: new Date(2023, 7, 16),
      doctorName: "Dr. Robert Johnson"
    },
    { 
      id: "LT003", 
      patientName: "Alex Brown", 
      patientId: "P003", 
      testName: "Thyroid Function Test", 
      status: "pending", 
      orderedDate: new Date(2023, 7, 16),
      doctorName: "Dr. Emily Williams"
    },
    { 
      id: "LT004", 
      patientName: "Maria Garcia", 
      patientId: "P004", 
      testName: "Blood Glucose", 
      status: "pending", 
      orderedDate: new Date(2023, 7, 17),
      doctorName: "Dr. Michael Davis"
    },
    { 
      id: "LT005", 
      patientName: "Robert Wilson", 
      patientId: "P005", 
      testName: "Liver Function Test", 
      status: "pending", 
      orderedDate: new Date(2023, 7, 17),
      doctorName: "Dr. Sarah Smith"
    }
  ]);

  const [completedTests, setCompletedTests] = useState<LabTest[]>([
    { 
      id: "LT006", 
      patientName: "David Lee", 
      patientId: "P006", 
      testName: "Complete Blood Count", 
      status: "completed", 
      orderedDate: new Date(2023, 7, 14),
      completedDate: new Date(2023, 7, 15),
      resultUrl: "https://example.com/results/LT006.pdf",
      doctorName: "Dr. Robert Johnson"
    },
    { 
      id: "LT007", 
      patientName: "Lucy Chen", 
      patientId: "P007", 
      testName: "Urine Analysis", 
      status: "completed", 
      orderedDate: new Date(2023, 7, 13),
      completedDate: new Date(2023, 7, 14),
      resultUrl: "https://example.com/results/LT007.pdf",
      doctorName: "Dr. Emily Williams"
    }
  ]);

  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [billItems, setBillItems] = useState<LabBillItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<LabCustomer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const labTestOptions = [
    { id: "LT101", testName: "Complete Blood Count (CBC)", price: 25.00, category: 'pathology' },
    { id: "LT102", testName: "Lipid Profile", price: 35.00, category: 'pathology' },
    { id: "LT103", testName: "Thyroid Function Test", price: 45.00, category: 'pathology' },
    { id: "LT104", testName: "Liver Function Test", price: 40.00, category: 'pathology' },
    { id: "LT105", testName: "Kidney Function Test", price: 42.00, category: 'pathology' },
    { id: "LT106", testName: "HbA1c", price: 30.00, category: 'pathology' },
    { id: "LT107", testName: "X-Ray Chest", price: 60.00, category: 'radiology' },
    { id: "LT108", testName: "Ultrasound Abdomen", price: 80.00, category: 'radiology' },
    { id: "LT109", testName: "CT Scan Head", price: 250.00, category: 'radiology' },
    { id: "LT110", testName: "MRI Brain", price: 350.00, category: 'radiology' },
  ] as const;

  const customers: LabCustomer[] = [
    { id: "C1", name: "John Smith", mobile: "+1-555-123-4567", address: "123 Main St, Anytown" },
    { id: "C2", name: "Sarah Johnson", mobile: "+1-555-987-6543", address: "456 Oak Ave, Somewhere" },
    { id: "C3", name: "Michael Brown", mobile: "+1-555-456-7890", address: "789 Pine Rd, Nowhere" },
    { id: "C4", name: "Emily Davis", mobile: "+1-555-789-0123", address: "101 Maple Dr, Anywhere" }
  ];

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
  };

  const handleAddNewCustomer = () => {
    if (!searchTerm) return;
    
    const newCustomer = {
      id: `C${customers.length + 1}`,
      name: searchTerm,
      mobile: "New customer",
      address: "Please update address"
    };
    
    setSelectedCustomer(newCustomer);
    
    toast({
      title: "New customer added",
      description: "Please update customer details",
    });
  };

  const handleSelectCustomer = (customer: LabCustomer) => {
    setSelectedCustomer(customer);
    setSearchTerm(customer.name);
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
        title: "No customer selected",
        description: "Please select a customer before printing the bill",
        variant: "destructive"
      });
      return;
    }

    const newPendingTests = billItems.map((item, index) => ({
      id: `LT${Date.now()}-${index}`,
      patientName: selectedCustomer.name,
      patientId: selectedCustomer.id,
      testName: item.testName,
      status: 'pending' as const,
      orderedDate: new Date(),
      doctorName: "Self-Order"
    }));

    setPendingTests([...pendingTests, ...newPendingTests]);
    
    setBillItems([]);
    setSelectedCustomer(null);
    setSearchTerm("");
    
    toast({
      title: "Bill printed",
      description: "The tests have been added to pending tests",
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Laboratory Services</h1>
      
      <Tabs defaultValue="billing" className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="billing">Lab Billing</TabsTrigger>
          <TabsTrigger value="management">Test Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="billing">
          <LabMetricsPanel 
            pendingTests={pendingTests}
            completedTests={completedTests}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Billing</CardTitle>
                <CardDescription>Manage customer bill</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <LabBillingPanel
                  billItems={billItems}
                  updateItemQuantity={updateItemQuantity}
                  removeItem={removeItem}
                  subtotal={calculateSubtotal()}
                  platformFee={10.00}
                  total={calculateSubtotal() + 10.00}
                  onPrintBill={handlePrintBill}
                  customerName={selectedCustomer?.name}
                  customers={customers}
                  selectedCustomer={selectedCustomer}
                  onSelectCustomer={handleSelectCustomer}
                  onAddNewCustomer={handleAddNewCustomer}
                  searchTerm={searchTerm}
                  onSearchCustomer={handleSearchCustomer}
                />
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Available Tests</CardTitle>
                <CardDescription>Select tests to add to the bill</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <LabSearchPanel 
                  testOptions={labTestOptions}
                  onAddToBill={addItemToBill}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="management">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="pending">Pending Tests ({pendingTests.length})</TabsTrigger>
                  <TabsTrigger value="completed">Completed Tests ({completedTests.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pending">
                  <Card>
                    <CardHeader>
                      <CardTitle>Pending Tests</CardTitle>
                      <CardDescription>Tests waiting to be processed</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PendingTestsList 
                        tests={pendingTests}
                        onSelectTest={handleSelectTest}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="completed">
                  <Card>
                    <CardHeader>
                      <CardTitle>Completed Tests</CardTitle>
                      <CardDescription>Tests with uploaded results</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CompletedTestsList tests={completedTests} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Upload Test Results</CardTitle>
                  <CardDescription>
                    Select a test from the pending list and upload its results
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedTest ? (
                    <UploadTestResultForm 
                      test={selectedTest}
                      onUpload={handleUploadResult}
                      onCancel={() => setSelectedTest(null)}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
                      <p>Select a test from the pending list to upload results</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LabTestsPage;
