
import { LabBillItem, LabCustomer } from "@/types/lab-types";
import CustomerSearch from "./CustomerSearch";
import BillItem from "./BillItem";
import BillSummary from "./BillSummary";

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
  onEditCustomer?: () => void;
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
  customers,
  selectedCustomer,
  onSelectCustomer,
  onAddNewCustomer,
  onEditCustomer,
  searchTerm,
  onSearchCustomer
}: LabBillingPanelProps) => {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <CustomerSearch 
          customers={customers}
          selectedCustomer={selectedCustomer}
          onSelectCustomer={onSelectCustomer}
          onAddNewCustomer={onAddNewCustomer}
          onEditCustomer={onEditCustomer}
          searchTerm={searchTerm}
          onSearchCustomer={onSearchCustomer}
        />
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
              <BillItem 
                key={item.id}
                item={item}
                updateItemQuantity={updateItemQuantity}
                removeItem={removeItem}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="border-t">
        <div className="p-3">
          <BillSummary
            subtotal={subtotal}
            platformFee={platformFee}
            total={total}
            onPrintBill={onPrintBill}
          />
        </div>
      </div>
    </div>
  );
};

export default LabBillingPanel;
