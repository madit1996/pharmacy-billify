
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import BillingPanel from "@/components/BillingPanel";
import PharmacyHeader from "@/components/pharmacy/PharmacyHeader";
import MedicineTabsPanel from "@/components/pharmacy/MedicineTabsPanel";
import WaitlistSidebar, { WaitlistPatient } from "@/components/pharmacy/WaitlistSidebar";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import CollapsibleSidebar from "@/components/pharmacy/CollapsibleSidebar";
import Sidebar from "@/components/Sidebar";

export type BillItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  dosage: string;
  discount: number;
};

const PharmacyPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const { toast } = useToast();

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
    
    toast({
      title: "Patient selected",
      description: `${patient.name}'s prescription loaded`,
    });
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
    <div className="h-full flex overflow-hidden">
      {/* Left Sidebar - Navigation */}
      <CollapsibleSidebar 
        collapsed={leftSidebarCollapsed}
        onToggleCollapse={() => setLeftSidebarCollapsed(!leftSidebarCollapsed)}
        side="left"
      >
        <Sidebar />
      </CollapsibleSidebar>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header/Invoice Section */}
        <PharmacyHeader date={date} setDate={setDate} />
        
        <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
          {/* Left Panel - Bill */}
          <ResizablePanel defaultSize={30} minSize={25} className="overflow-hidden">
            <BillingPanel 
              billItems={billItems} 
              updateItemQuantity={updateItemQuantity} 
              removeItem={removeItem}
              subtotal={calculateSubtotal()}
              platformFee={platformFee}
              total={total}
              onPrintBill={handlePrintBill}
            />
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Right Panel - Medicines */}
          <ResizablePanel defaultSize={70} minSize={40} className="overflow-hidden">
            <MedicineTabsPanel onAddToBill={addItemToBill} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      
      {/* Right Sidebar - Waitlist */}
      <WaitlistSidebar 
        onSelectPatient={handleSelectPatient}
        collapsed={rightSidebarCollapsed}
        onToggleCollapse={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
      />
    </div>
  );
};

export default PharmacyPage;
