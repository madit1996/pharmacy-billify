
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LabBillingPanel from "./LabBillingPanel";
import LabSearchPanel from "./LabSearchPanel";
import { useLabContext } from "@/contexts/LabContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PatientForm from "./PatientForm";

const LabBillingTab = () => {
  const { 
    billItems,
    updateItemQuantity,
    removeItem,
    calculateSubtotal,
    handlePrintBill,
    searchTerm,
    handleSearchCustomer,
    labTestOptions,
    addItemToBill,
    customers,
    selectedCustomer,
    handleSelectCustomer,
    handleAddNewCustomer,
    handleEditCustomer,
    handleSaveCustomer,
    isEditingCustomer,
    setIsEditingCustomer
  } = useLabContext();
  
  const subtotal = calculateSubtotal();
  const platformFee = 10.00;
  const total = subtotal + platformFee;

  return (
    <>
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
              onPrintBill={handlePrintBill}
              customerName={selectedCustomer?.name}
              customers={customers}
              selectedCustomer={selectedCustomer}
              onSelectCustomer={handleSelectCustomer}
              onAddNewCustomer={handleAddNewCustomer}
              searchTerm={searchTerm}
              onSearchCustomer={handleSearchCustomer}
              onEditCustomer={handleEditCustomer}
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
              testOptions={labTestOptions}
              onAddToBill={addItemToBill}
            />
          </CardContent>
        </Card>
      </div>

      {/* Patient Edit Dialog */}
      <Dialog open={isEditingCustomer} onOpenChange={setIsEditingCustomer}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedCustomer?.id && !customers.some(c => c.id === selectedCustomer.id)
                ? 'Add New Patient'
                : 'Edit Patient Details'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedCustomer && (
            <PatientForm 
              patient={selectedCustomer} 
              onSave={handleSaveCustomer} 
              onCancel={() => setIsEditingCustomer(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LabBillingTab;
