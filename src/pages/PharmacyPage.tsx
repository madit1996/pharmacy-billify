
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import BillingPanel from "@/components/BillingPanel";
import WaitlistPanel from "@/components/WaitlistPanel";
import PharmacyHeader from "@/components/pharmacy/PharmacyHeader";
import MedicineTabsPanel from "@/components/pharmacy/MedicineTabsPanel";

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

  const platformFee = 0.10;
  const total = calculateSubtotal() + platformFee;

  const handlePrintBill = () => {
    toast({
      title: "Bill printed",
      description: "The bill has been sent to the printer",
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header/Invoice Section */}
      <PharmacyHeader date={date} setDate={setDate} />
      
      <div className="flex flex-1 gap-4 overflow-hidden">
        {/* Left Panel - Bill */}
        <div className="w-2/5 flex flex-col overflow-hidden">
          <BillingPanel 
            billItems={billItems} 
            updateItemQuantity={updateItemQuantity} 
            removeItem={removeItem}
            subtotal={calculateSubtotal()}
            platformFee={platformFee}
            total={total}
            onPrintBill={handlePrintBill}
          />
        </div>
        
        {/* Right Panel - Medicines and Waitlist */}
        <div className="w-3/5 flex flex-col">
          <MedicineTabsPanel onAddToBill={addItemToBill} />
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <WaitlistPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyPage;
