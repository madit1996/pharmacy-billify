
import { useState } from "react";
import { LabTest, LabTestStatus } from "@/types/lab-tests";
import { LabBillItem, LabCustomer } from "@/types/lab-types";
import { initialCustomers } from "@/contexts/lab/LabInitialData";
import { useToast } from "@/hooks/use-toast";

export function useLabBilling(setPendingTests: React.Dispatch<React.SetStateAction<LabTest[]>>, pendingTests: LabTest[]) {
  const [billItems, setBillItems] = useState<LabBillItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<LabCustomer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [customersState, setCustomersState] = useState<LabCustomer[]>(initialCustomers);
  const { toast } = useToast();

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
        fromStatus: 'pending' as LabTestStatus,
        toStatus: 'sampling' as LabTestStatus,
        timestamp: new Date(),
        notes: 'Initial status'
      }]
    }));

    setPendingTests([...pendingTests, ...newPendingTests]);
    
    setBillItems([]);
    setSelectedCustomer(null);
    setSearchTerm("");
    
    toast({
      title: "Bill generated",
      description: `Bill #${billId} created with ${newPendingTests.length} test(s)`,
    });
  };

  return {
    billItems,
    selectedCustomer,
    searchTerm,
    isEditingCustomer,
    customersState: customersState,
    addItemToBill,
    updateItemQuantity,
    removeItem,
    calculateSubtotal,
    handleSearchCustomer,
    handleAddNewCustomer,
    handleEditCustomer,
    handleSaveCustomer,
    handleSelectCustomer,
    handlePrintBill,
    updateTestStatus,
    assignTestToRepresentative,
    setIsEditingCustomer
  };
}
