
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LabBillingPanel from "./LabBillingPanel";
import LabSearchPanel from "./LabSearchPanel";
import { LabBillItem, LabCustomer, LabTestOption } from "@/types/lab-types";

interface LabBillingTabProps {
  billItems: LabBillItem[];
  updateItemQuantity: (id: string, change: number) => void;
  removeItem: (id: string) => void;
  calculateSubtotal: () => number;
  onPrintBill: () => void;
  searchTerm: string;
  onSearchCustomer: (term: string) => void;
  testOptions: readonly LabTestOption[];
  onAddToBill: (item: LabBillItem) => void;
  customers: LabCustomer[];
  selectedCustomer: LabCustomer | null;
  onSelectCustomer: (customer: LabCustomer) => void;
  onAddNewCustomer: () => void;
}

const LabBillingTab = ({
  billItems,
  updateItemQuantity,
  removeItem,
  calculateSubtotal,
  onPrintBill,
  searchTerm,
  onSearchCustomer,
  testOptions,
  onAddToBill,
  customers,
  selectedCustomer,
  onSelectCustomer,
  onAddNewCustomer
}: LabBillingTabProps) => {
  const subtotal = calculateSubtotal();
  const platformFee = 10.00;
  const total = subtotal + platformFee;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>Manage patient bill</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <LabBillingPanel
            billItems={billItems}
            updateItemQuantity={updateItemQuantity}
            removeItem={removeItem}
            subtotal={subtotal}
            platformFee={platformFee}
            total={total}
            onPrintBill={onPrintBill}
            customerName={selectedCustomer?.name}
            customers={customers}
            selectedCustomer={selectedCustomer}
            onSelectCustomer={onSelectCustomer}
            onAddNewCustomer={onAddNewCustomer}
            searchTerm={searchTerm}
            onSearchCustomer={onSearchCustomer}
          />
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Available Tests</CardTitle>
          <CardDescription>Select tests to add to the bill</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <LabSearchPanel 
            testOptions={testOptions}
            onAddToBill={onAddToBill}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LabBillingTab;
