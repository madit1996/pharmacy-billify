
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LabBillingPanel from "./LabBillingPanel";
import LabSearchPanel from "./LabSearchPanel";
import { useLabContext } from "@/contexts/LabContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PatientForm from "./PatientForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import CollapsibleSidebar from "@/components/pharmacy/CollapsibleSidebar";
import LabWaitlistSidebar from "./LabWaitlistSidebar";
import { useState } from "react";

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
    setIsEditingCustomer,
    assignTestToRepresentative,
    waitlistPatients,
    handleSelectWaitlistPatient
  } = useLabContext();
  
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  
  const subtotal = calculateSubtotal();
  const platformFee = 10.00;
  const total = subtotal + platformFee;

  return (
    <>
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
            <ResizablePanel defaultSize={40} minSize={30} className="overflow-hidden">
              <Card className="h-full border-0 rounded-none shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle>Billing</CardTitle>
                  <CardDescription>Manage patient bill</CardDescription>
                </CardHeader>
                <CardContent className="p-0 h-[calc(100%-5rem)]">
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
                    onEditCustomer={handleEditCustomer}
                    searchTerm={searchTerm}
                    onSearchCustomer={handleSearchCustomer}
                    assignTestToRepresentative={assignTestToRepresentative}
                  />
                </CardContent>
              </Card>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={60} minSize={40} className="overflow-hidden">
              <Card className="h-full border-0 rounded-none shadow-none">
                <CardHeader className="pb-2">
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
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        
        <CollapsibleSidebar 
          collapsed={rightSidebarCollapsed}
          onToggleCollapse={() => setRightSidebarCollapsed(!rightSidebarCollapsed)}
          side="right"
          className="bg-white border-l"
        >
          <LabWaitlistSidebar 
            waitlistPatients={waitlistPatients}
            onSelectPatient={handleSelectWaitlistPatient}
            collapsed={rightSidebarCollapsed}
          />
        </CollapsibleSidebar>
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
