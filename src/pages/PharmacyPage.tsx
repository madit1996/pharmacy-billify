
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BillingPanel from "@/components/BillingPanel";
import PharmacyHeader from "@/components/pharmacy/PharmacyHeader";
import MedicineTabsPanel from "@/components/pharmacy/MedicineTabsPanel";
import WaitlistSidebar, { WaitlistPatient } from "@/components/pharmacy/WaitlistSidebar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import CollapsibleSidebar from "@/components/pharmacy/CollapsibleSidebar";
import { Button } from "@/components/ui/button";

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
  const [date, setDate] = useState<Date>(new Date());
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // Dummy customer data
  const customers: CustomerDetails[] = [
    { id: "C1", name: "Yuda Rahmat", mobile: "+62-812-3456-7890", address: "123 Jakarta Street, Indonesia" },
    { id: "C2", name: "Aulia Akbar", mobile: "+62-813-5678-9012", address: "456 Bandung Road, Indonesia" },
    { id: "C3", name: "Haul Anggara", mobile: "+62-815-7890-1234", address: "789 Surabaya Lane, Indonesia" },
    { id: "C4", name: "Mira Santoso", mobile: "+62-817-2345-6789", address: "101 Bali Avenue, Indonesia" }
  ];

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
    // In a real app, this would open a form to add a new customer
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

  const handleSearchCustomer = (term: string) => {
    setSearchTerm(term);
    // If we had a real search, we would filter customers here
  };

  const platformFee = 0.10;
  const total = calculateSubtotal() + platformFee;

  const handlePrintBill = () => {
    toast({
      title: "Bill printed",
      description: "The bill has been sent to the printer",
    });
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      {/* Navigation back to dashboard */}
      <div className="bg-white border-b p-2 flex items-center">
        <Link to="/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
        </Link>
      </div>
      
      {/* Main Content */}
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
    </div>
  );
};

export default PharmacyPage;
