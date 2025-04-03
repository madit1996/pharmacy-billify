
import { LabBillItem, LabCustomer } from "@/types/lab-types";
import CustomerSearch from "./CustomerSearch";
import BillItem from "./BillItem";
import BillSummary from "./BillSummary";
import { BeakerIcon } from "./LabIcons";

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
    <div className="flex flex-col h-full bg-gradient-to-r from-slate-50 to-white rounded-lg overflow-hidden shadow-sm">
      <div className="p-4 border-b bg-gradient-to-r from-purple-500 to-blue-500">
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

      <div className="px-4 py-2 bg-gradient-to-r from-slate-800 to-gray-700 text-white flex items-center justify-between text-xs">
        <div className="text-left">Test</div>
        <div className="text-center">Qty</div>
        <div className="text-right">Price</div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 bg-white">
        {billItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <BeakerIcon className="h-12 w-12 mb-2 opacity-30" />
            <p>No tests added to the bill yet</p>
            <p className="text-xs mt-2">Search or select lab tests to add them to the bill</p>
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
      
      <div className="border-t bg-gradient-to-b from-white to-slate-50">
        <div className="p-4">
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
