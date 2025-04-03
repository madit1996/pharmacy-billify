
import { Minus, Plus, Printer, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BillItem, CustomerDetails } from "@/pages/PharmacyPage";
import PaymentOptions from "./PaymentOptions";
import { Badge } from "@/components/ui/badge";

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
    <div className="flex flex-col h-full bg-gradient-to-r from-slate-50 to-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-between">
        <div className="text-left text-sm">Item Details</div>
        <div className="text-center text-sm">Quantity</div>
        <div className="text-right text-sm">Amount</div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3">
        {selectedCustomer ? (
          <div className="mb-3 p-3 bg-blue-50 rounded-md border border-blue-100 flex justify-between items-center">
            <div>
              <span className="text-xs text-blue-600 font-medium">CUSTOMER</span>
              <h3 className="font-medium text-blue-800">{selectedCustomer.name}</h3>
              <div className="text-xs text-gray-500 mt-1">{selectedCustomer.mobile}</div>
            </div>
            {onEditCustomer && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 border-blue-300 hover:bg-blue-100" 
                onClick={onEditCustomer}
              >
                <Edit2 className="h-3 w-3 mr-1 text-blue-600" />
                <span className="text-xs text-blue-600">Edit</span>
              </Button>
            )}
          </div>
        ) : customerName && customerName !== "Guest" ? (
          <div className="mb-4 p-3 bg-gray-50 rounded-md border flex justify-between items-center">
            <div>
              <span className="text-xs text-gray-500 font-medium">CUSTOMER</span>
              <h3 className="font-medium">{customerName}</h3>
            </div>
          </div>
        ) : null}
        
        {billItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <ShoppingCartIcon className="h-12 w-12 mb-2 opacity-30" />
            <p>No items added to the bill yet</p>
            <p className="text-xs mt-2">Search or select items to add to the bill</p>
          </div>
        ) : (
          <div className="space-y-4">
            {billItems.map((item) => (
              <div key={item.id} className="bg-white p-3 border rounded-md shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-50 rounded-md mr-3 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-1">{item.dosage}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center">
                        {item.discount > 0 && (
                          <Badge variant="outline" className="text-xs mr-2 bg-green-50 border-green-200 text-green-700">
                            {item.discount}% OFF
                          </Badge>
                        )}
                        <span className="text-sm font-medium text-blue-600">$ {item.price.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex items-center rounded-md border border-gray-200 overflow-hidden">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="px-2 h-7 rounded-none bg-gray-50 hover:bg-gray-100 text-gray-600"
                          onClick={() => updateItemQuantity(item.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="px-2 h-7 rounded-none bg-gray-50 hover:bg-blue-100 text-blue-600"
                          onClick={() => updateItemQuantity(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="text-right font-semibold">
                        $ {(item.price * item.quantity * (1 - item.discount / 100)).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="border-t bg-gradient-to-b from-white to-slate-50">
        <div className="p-3">
          <h3 className="font-medium text-base mb-3 text-gray-700">Summary</h3>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">$ {subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Platform fee</span>
              <span className="font-medium">$ {platformFee.toFixed(2)}</span>
            </div>
            
            <Separator className="my-2" />
            
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span className="text-blue-600">$ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="px-3 pb-3">
          <Button 
            className="w-full h-12 text-base font-medium bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 transition-all shadow-md hover:shadow-lg"
            onClick={onPrintBill}
          >
            <Printer className="mr-2 h-5 w-5" />
            Complete & Print Bill
          </Button>
        </div>
        
        <PaymentOptions />
      </div>
    </div>
  );
};

// Simple cart icon component
const ShoppingCartIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

export default BillingPanel;
