
import { Minus, Plus, Printer, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BillItem } from "@/pages/PharmacyPage";
import PaymentOptions from "./PaymentOptions";

interface BillingPanelProps {
  billItems: BillItem[];
  updateItemQuantity: (id: string, change: number) => void;
  removeItem: (id: string) => void;
  subtotal: number;
  platformFee: number;
  total: number;
  onPrintBill: () => void;
}

const BillingPanel = ({
  billItems,
  updateItemQuantity,
  removeItem,
  subtotal,
  platformFee,
  total,
  onPrintBill
}: BillingPanelProps) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-3 bg-gray-800 text-white flex items-center justify-between">
        <div className="text-left">Item Code</div>
        <div className="text-center">Qty</div>
        <div className="text-center">Price</div>
        <div className="text-center">Disc.</div>
        <div className="text-right">Total</div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {billItems.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No items added to the bill yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {billItems.map((item) => (
              <div key={item.id} className="relative">
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-gray-100 rounded-md mr-4 overflow-hidden">
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
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="text-sm text-gray-500 mt-1">{item.dosage}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center">
                        <span className="text-lg font-medium text-green-600">$ {item.price.toFixed(2)}</span>
                        <span className="text-sm text-gray-500 ml-1">/ Strip</span>
                      </div>
                      
                      <div className="flex items-center border rounded-md">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="px-2 h-8"
                          onClick={() => updateItemQuantity(item.id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        
                        <span className="w-8 text-center">{item.quantity}</span>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="px-2 h-8"
                          onClick={() => updateItemQuantity(item.id, 1)}
                        >
                          <Plus className="h-4 w-4 text-pharmacy-primary" />
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
        <div className="p-4">
          <h3 className="font-medium text-lg mb-4">Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">$ {subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Platform fee</span>
              <span className="font-medium">$ {platformFee.toFixed(2)}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between text-lg font-medium">
              <span>Total</span>
              <span>$ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <div className="p-4 pt-0">
          <Button 
            className="w-full h-12 text-lg bg-pharmacy-primary hover:bg-pharmacy-primary/90"
            onClick={onPrintBill}
          >
            <Printer className="mr-2 h-5 w-5" />
            Print Bill
          </Button>
        </div>
        
        <PaymentOptions />
      </div>
    </div>
  );
};

export default BillingPanel;
