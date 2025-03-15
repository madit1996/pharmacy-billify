
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PharmacyNavigation from "@/components/pharmacy/PharmacyNavigation";
import PharmacyAnalyticsTab from "@/components/pharmacy/PharmacyAnalyticsTab";

// Import existing pharmacy components
import BillingPanel from "@/components/BillingPanel";
import PharmacyHeader from "@/components/pharmacy/PharmacyHeader";
import MedicineTabsPanel from "@/components/pharmacy/MedicineTabsPanel";
import WaitlistSidebar, { WaitlistPatient } from "@/components/pharmacy/WaitlistSidebar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import CollapsibleSidebar from "@/components/pharmacy/CollapsibleSidebar";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PatientForm from "@/components/pharmacy/PatientForm";

export type BillItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  dosage: string;
  discount: number;
};

export type CustomerDetails = {
  id: string;
  name: string;
  mobile: string;
  address: string;
  email?: string;
};

const PharmacyPage = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'billing'>('billing');
  
  // Original state from PharmacyPage
  const [date, setDate] = useState<Date>(new Date());
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPatientDialogOpen, setIsPatientDialogOpen] = useState(false);
  const { toast } = useToast();

  // Dummy customer data
  const [customers, setCustomers] = useState<CustomerDetails[]>([
    { id: "C1", name: "Yuda Rahmat", mobile: "+62-812-3456-7890", address: "123 Jakarta Street, Indonesia" },
    { id: "C2", name: "Aulia Akbar", mobile: "+62-813-5678-9012", address: "456 Bandung Road, Indonesia" },
    { id: "C3", name: "Haul Anggara", mobile: "+62-815-7890-1234", address: "789 Surabaya Lane, Indonesia" },
    { id: "C4", name: "Mira Santoso", mobile: "+62-817-2345-6789", address: "101 Bali Avenue, Indonesia" }
  ]);

  const addItemToBill = (item: BillItem) => {
    // Check if item already exists in bill
    const existingItemIndex = billItems.findIndex((i) => i.id === item.id);
    
    if (existingItemIndex !== -1) {
      // Update quantity of existing item
      const updatedItems = [...billItems];
      updatedItems[existingItemIndex].quantity += 1;
      setBillItems(updatedItems);
    } else {
      // Add new item to bill
      setBillItems([...billItems, item]);
    }
    
    toast({
      title: "Added to bill",
      description: `${item.name} has been added to the bill`,
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

  const handleSelectPatient = (patient: WaitlistPatient) => {
    // Clear existing items and add the patient's prescriptions
    setBillItems(patient.prescriptions);
    
    // Find and set the customer details
    const customer = customers.find(c => c.name === patient.name) || 
      { id: patient.id, name: patient.name, mobile: "Unknown", address: "Unknown" };
    
    setSelectedCustomer(customer);
    
    toast({
      title: "Patient selected",
      description: `${patient.name}'s prescription loaded`,
    });
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
    
    // Check if the customer already exists
    const existingCustomer = customers.find(c => 
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
      id: `C${customers.length + 1}`,
      name: searchTerm,
      mobile: "New customer",
      address: "Please update address"
    };
    
    setSelectedCustomer(newCustomer);
    setIsPatientDialogOpen(true);
    
    toast({
      title: "New customer added",
      description: "Please update customer details",
    });
  };

  const handleSearchCustomer = (term: string) => {
    setSearchTerm(term);
    // If we find an exact match, select that customer
    const matchedCustomer = customers.find(
      c => c.name.toLowerCase() === term.toLowerCase()
    );
    
    if (matchedCustomer) {
      setSelectedCustomer(matchedCustomer);
    } else if (selectedCustomer && term.length === 0) {
      // Clear selection if search is cleared
      setSelectedCustomer(null);
    }
  };

  const handleEditCustomer = () => {
    if (selectedCustomer) {
      setIsPatientDialogOpen(true);
    }
  };

  const handleSavePatient = (updatedPatient: CustomerDetails) => {
    // Update in the customers list if it exists
    const customerIndex = customers.findIndex(c => c.id === updatedPatient.id);
    if (customerIndex !== -1) {
      const updatedCustomers = [...customers];
      updatedCustomers[customerIndex] = updatedPatient;
      setCustomers(updatedCustomers);
    } else {
      // Add new customer to the list
      setCustomers([...customers, updatedPatient]);
    }
    
    // Update selected customer
    setSelectedCustomer(updatedPatient);
    setIsPatientDialogOpen(false);
    
    toast({
      title: "Patient saved",
      description: "Patient details have been updated successfully",
    });
  };

  const platformFee = 0.10;
  const total = calculateSubtotal() + platformFee;

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

    toast({
      title: "Bill printed",
      description: "The bill has been sent to the printer",
    });
    
    // Clear the billing state
    setBillItems([]);
    setSelectedCustomer(null);
    setSearchTerm("");
  };

  // Render billing tab content
  const renderBillingContent = () => {
    return (
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header/Invoice Section */}
          <PharmacyHeader 
            date={date} 
            setDate={setDate} 
            selectedCustomer={selectedCustomer}
            onSearchCustomer={handleSearchCustomer}
            onAddNewCustomer={handleAddNewCustomer}
            searchTerm={searchTerm}
            onEditCustomer={handleEditCustomer}
          />
          
          <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
            {/* Left Panel - Bill */}
            <ResizablePanel defaultSize={40} minSize={30} className="overflow-hidden">
              <BillingPanel 
                billItems={billItems} 
                updateItemQuantity={updateItemQuantity} 
                removeItem={removeItem}
                subtotal={calculateSubtotal()}
                platformFee={platformFee}
                total={total}
                onPrintBill={handlePrintBill}
                customerName={selectedCustomer?.name}
              />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Right Panel - Medicines */}
            <ResizablePanel defaultSize={60} minSize={40} className="overflow-hidden">
              <MedicineTabsPanel onAddToBill={addItemToBill} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        
        {/* Right Sidebar - Waitlist */}
        <CollapsibleSidebar 
          collapsed={rightSidebarCollapsed}
          onToggleCollapse={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
          side="right"
          className="bg-white border-l"
        >
          <WaitlistSidebar 
            onSelectPatient={handleSelectPatient}
            collapsed={rightSidebarCollapsed}
          />
        </CollapsibleSidebar>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Navigation back to dashboard */}
      <div className="bg-white border-b p-2 flex items-center justify-between">
        <Link to="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
        </Link>
        <PharmacyNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      {/* Tab Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {activeTab === 'analytics' && (
          <div className="flex-1 overflow-auto p-4">
            <PharmacyAnalyticsTab />
          </div>
        )}
        
        {activeTab === 'billing' && renderBillingContent()}
      </div>

      {/* Patient Edit Dialog */}
      <Dialog open={isPatientDialogOpen} onOpenChange={setIsPatientDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedCustomer?.id.startsWith('C') && !customers.some(c => c.id === selectedCustomer.id) ? 'Add New Patient' : 'Edit Patient Details'}</DialogTitle>
          </DialogHeader>
          
          {selectedCustomer && (
            <PatientForm 
              patient={selectedCustomer} 
              onSave={handleSavePatient} 
              onCancel={() => setIsPatientDialogOpen(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PharmacyPage;
