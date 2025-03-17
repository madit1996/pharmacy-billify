
import { Minus, Plus, Printer, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BillItem, CustomerDetails } from "@/pages/PharmacyPage";
import PaymentOptions from "./PaymentOptions";

interface BillingPanelProps {
  billItems: BillItem[];
  updateItemQuantity: (id: string, change: number) => void;
  removeItem: (id: string) => void;
  subtotal: number;
  platformFee: number;
  total: number;
  onPrintBill: () => void;
  customerName?: string;
  customers?: CustomerDetails[];
  selectedCustomer: CustomerDetails | null;
  onSelectCustomer?: (customer: CustomerDetails) => void;
  onAddNewCustomer: () => void;
  onEditCustomer?: () => void;
  searchTerm: string;
  onSearchCustomer: (term: string) => void;
}

const BillingPanel = ({
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
  onAddNewCustomer,
  onEditCustomer,
  searchTerm,
  onSearchCustomer
}: BillingPanelProps) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-2 bg-gray-800 text-white flex items-center justify-between text-xs">
        <div className="text-left">Item Code</div>
        <div className="text-center">Qty</div>
        <div className="text-center">Price</div>
        <div className="text-center">Disc.</div>
        <div className="text-right">Total</div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        {selectedCustomer ? (
          <div className="mb-2 text-sm text-gray-500 flex justify-between items-center">
            <span>
              Customer: <span className="font-medium text-gray-700">{selectedCustomer.name}</span>
            </span>
            {onEditCustomer && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 py-0" 
                onClick={onEditCustomer}
              >
                <Edit2 className="h-3 w-3 mr-1" />
                <span className="text-xs">Edit</span>
              </Button>
            )}
          </div>
        ) : customerName && customerName !== "Guest" ? (
          <div className="mb-2 text-sm text-gray-500">
            Customer: <span className="font-medium text-gray-700">{customerName}</span>
          </div>
        ) : null}
        
        {billItems.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            <p>No items added to the bill yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {billItems.map((item) => (
              <div key={item.id} className="relative">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-gray-100 rounded-md mr-3 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{item.dosage}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-green-600">$ {item.price.toFixed(2)}</span>
                        <span className="text-xs text-gray-500 ml-1">/ Strip</span>
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
                          <Plus className="h-3 w-3 text-pharmacy-primary" />
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
              <span className="text-gray-600">Platform fee</span>
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
            className="w-full h-10 text-base bg-pharmacy-primary hover:bg-pharmacy-primary/90"
            onClick={onPrintBill}
          >
            <Printer className="mr-2 h-4 w-4" />
            Print Bill
          </Button>
        </div>
        
        <PaymentOptions />
      </div>
    </div>
  );
};

export default BillingPanel;
