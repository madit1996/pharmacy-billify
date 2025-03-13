
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Minus, Plus, Printer, Search, Edit2, CreditCard, Landmark, Package, ShoppingCart, Tag } from "lucide-react";
import { format } from "date-fns";
import BillingPanel from "@/components/BillingPanel";
import MedicineSearchPanel from "@/components/MedicineSearchPanel";
import WaitlistPanel from "@/components/WaitlistPanel";
import { useToast } from "@/hooks/use-toast";

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
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="col-span-2 grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label htmlFor="invoice-type" className="text-xs mb-1">TAX INVOICE</label>
            <Select defaultValue="gst">
              <SelectTrigger id="invoice-type">
                <SelectValue placeholder="Select invoice type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gst">GST</SelectItem>
                <SelectItem value="vat">VAT</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="customer" className="text-xs mb-1">Search Customer</label>
            <Select>
              <SelectTrigger id="customer">
                <SelectValue placeholder="--Select--" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john">John Doe</SelectItem>
                <SelectItem value="jane">Jane Smith</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="address" className="text-xs mb-1">Mob., Address</label>
            <Input id="address" placeholder="Enter mobile or address" />
          </div>
          
          <div className="flex flex-col">
            <label htmlFor="remarks" className="text-xs mb-1">Remark</label>
            <Input id="remarks" placeholder="Enter remarks" />
          </div>
        </div>
        
        <div className="flex flex-col">
          <label htmlFor="invoice-number" className="text-xs mb-1">Invoice Number</label>
          <div className="grid grid-cols-2 gap-2">
            <Input id="invoice-number" value="31-03-2024" readOnly />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-10 w-10 p-0">
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 gap-4 overflow-hidden">
        <div className="w-1/2 flex flex-col overflow-hidden">
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
        
        <div className="w-1/2 flex flex-col">
          <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
            <Tabs defaultValue="medicines">
              <div className="bg-gray-50 p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Medicines</h3>
                  <div className="flex space-x-3">
                    <Select defaultValue="sort">
                      <SelectTrigger className="h-8 w-24">
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sort">Sort By</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="price">Price</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="expiry">
                      <SelectTrigger className="h-8 w-28">
                        <SelectValue placeholder="Expiry Date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="expiry">Expiry Date</SelectItem>
                        <SelectItem value="asc">Ascending</SelectItem>
                        <SelectItem value="desc">Descending</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="margins">
                      <SelectTrigger className="h-8 w-24">
                        <SelectValue placeholder="Margins" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="margins">Margins</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="fifo">
                      <SelectTrigger className="h-8 w-20">
                        <SelectValue placeholder="FIFO" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fifo">FIFO</SelectItem>
                        <SelectItem value="lifo">LIFO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <div className="relative flex-1">
                    <Input 
                      placeholder="Search Medicine/ Salt" 
                      className="pl-9"
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  </div>
                </div>
                <TabsList className="grid grid-cols-7 bg-pharmacy-gray">
                  <TabsTrigger value="medicines" className="data-[state=active]:bg-pharmacy-primary data-[state=active]:text-white">All</TabsTrigger>
                  <TabsTrigger value="tablet" className="data-[state=active]:bg-pharmacy-primary data-[state=active]:text-white">Tablet</TabsTrigger>
                  <TabsTrigger value="capsule" className="data-[state=active]:bg-pharmacy-primary data-[state=active]:text-white">Capsule</TabsTrigger>
                  <TabsTrigger value="suppository" className="data-[state=active]:bg-pharmacy-primary data-[state=active]:text-white">Suppository</TabsTrigger>
                  <TabsTrigger value="eyedrops" className="data-[state=active]:bg-pharmacy-primary data-[state=active]:text-white">Eyedrops</TabsTrigger>
                  <TabsTrigger value="inhaler" className="data-[state=active]:bg-pharmacy-primary data-[state=active]:text-white">Inhaler</TabsTrigger>
                  <TabsTrigger value="injectable" className="data-[state=active]:bg-pharmacy-primary data-[state=active]:text-white">Injectable</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="medicines" className="mt-0">
                <MedicineSearchPanel onAddToBill={addItemToBill} />
              </TabsContent>
              
              <TabsContent value="tablet" className="mt-0 p-4">
                <p className="text-sm text-gray-500">Tablet medicines will be shown here.</p>
              </TabsContent>
              
              <TabsContent value="capsule" className="mt-0 p-4">
                <p className="text-sm text-gray-500">Capsule medicines will be shown here.</p>
              </TabsContent>
              
              <TabsContent value="suppository" className="mt-0 p-4">
                <p className="text-sm text-gray-500">Suppository medicines will be shown here.</p>
              </TabsContent>
              
              <TabsContent value="eyedrops" className="mt-0 p-4">
                <p className="text-sm text-gray-500">Eyedrop medicines will be shown here.</p>
              </TabsContent>
              
              <TabsContent value="inhaler" className="mt-0 p-4">
                <p className="text-sm text-gray-500">Inhaler medicines will be shown here.</p>
              </TabsContent>
              
              <TabsContent value="injectable" className="mt-0 p-4">
                <p className="text-sm text-gray-500">Injectable medicines will be shown here.</p>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="mt-4">
            <WaitlistPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyPage;
