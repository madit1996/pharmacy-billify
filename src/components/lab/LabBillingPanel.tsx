
import { Minus, Plus, Printer, Edit2, User, Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { LabBillItem, LabCustomer } from "@/pages/LabTestsPage";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface LabBillingPanelProps {
  billItems: LabBillItem[];
  updateItemQuantity: (id: string, change: number) => void;
  removeItem: (id: string) => void;
  subtotal: number;
  platformFee: number;
  total: number;
  onPrintBill: () => void;
  customerName?: string;
  customers: LabCustomer[];
  selectedCustomer: LabCustomer | null;
  onSelectCustomer: (customer: LabCustomer) => void;
  onAddNewCustomer: () => void;
  searchTerm: string;
  onSearchCustomer: (term: string) => void;
}

const LabBillingPanel = ({
  billItems,
  updateItemQuantity,
  removeItem,
  subtotal,
  platformFee,
  total,
  onPrintBill,
  customerName = "Guest",
  customers,
  selectedCustomer,
  onSelectCustomer,
  onAddNewCustomer,
  searchTerm,
  onSearchCustomer
}: LabBillingPanelProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredCustomers = searchTerm 
    ? customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : customers;

  return (
    <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <div className="mb-4">
          <label htmlFor="customer" className="text-xs mb-1 font-medium block">Search Patient</label>
          <div className="relative">
            <Input 
              id="customer" 
              placeholder="Search patient" 
              className="h-9 pr-10"
              value={searchTerm}
              onChange={(e) => onSearchCustomer(e.target.value)}
              onFocus={() => setIsDropdownOpen(true)}
            />
            <DropdownMenu open={isDropdownOpen && searchTerm.length > 0} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0 h-full"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[calc(100%-20px)]">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map(customer => (
                    <DropdownMenuItem 
                      key={customer.id}
                      onClick={() => {
                        onSelectCustomer(customer);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {customer.name}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem onClick={() => {
                    onAddNewCustomer();
                    setIsDropdownOpen(false);
                  }}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add "{searchTerm}" as new patient
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {selectedCustomer && (
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              <span className="font-medium">{selectedCustomer.name}</span>
            </div>
            <div className="text-xs text-gray-500">
              Mobile: {selectedCustomer.mobile}
            </div>
            <div className="text-xs text-gray-500">
              Address: {selectedCustomer.address}
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-2 bg-gray-800 text-white flex items-center justify-between text-xs">
        <div className="text-left">Test</div>
        <div className="text-center">Qty</div>
        <div className="text-right">Price</div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        {billItems.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            <p>No tests added to the bill yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {billItems.map((item) => (
              <div key={item.id} className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 text-sm">{item.testName}</h4>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {item.category === 'pathology' ? 'Pathology' : 'Radiology'}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-green-600">$ {item.price.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex items-center border rounded-md">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="px-1 h-6"
                          onClick={() => updateItemQuantity(item.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="w-6 text-center text-xs">{item.quantity}</span>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="px-1 h-6"
                          onClick={() => updateItemQuantity(item.id, 1)}
                        >
                          <Plus className="h-3 w-3 text-blue-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="border-t">
        <div className="p-3">
          <h3 className="font-medium text-base mb-3">Summary</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">$ {subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Service fee</span>
              <span className="font-medium">$ {platformFee.toFixed(2)}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between text-base font-medium">
              <span>Total</span>
              <span>$ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="px-3 pb-3">
          <Button 
            className="w-full h-10 text-base bg-blue-600 hover:bg-blue-700"
            onClick={onPrintBill}
          >
            <Printer className="mr-2 h-4 w-4" />
            Generate Bill
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LabBillingPanel;
