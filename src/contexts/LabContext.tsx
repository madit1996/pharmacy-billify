
import { createContext, ReactNode, useContext } from "react";
import { LabContextType } from "./lab/LabContextTypes";
import { useLabTests } from "@/hooks/lab/useLabTests";
import { useLabBilling } from "@/hooks/lab/useLabBilling";
import { useLabWaitlist } from "@/hooks/lab/useLabWaitlist";
import { labTestOptions } from "./lab/LabInitialData";
import { useLabAnalytics } from "@/hooks/lab/useLabAnalytics";

const LabContext = createContext<LabContextType | undefined>(undefined);

export const LabProvider = ({ children }: { children: ReactNode }) => {
  const {
    pendingTests,
    completedTests,
    selectedTest,
    handleSelectTest,
    handleUploadResult,
    handleCreateReport,
    updateTestWorkflow,
    updateSampleDetails,
    setupHomeCollection,
    setPendingTests
  } = useLabTests();

  const {
    billItems,
    selectedCustomer,
    searchTerm,
    isEditingCustomer,
    customersState,
    addItemToBill,
    updateItemQuantity,
    removeItem,
    calculateSubtotal,
    handleSearchCustomer,
    handleAddNewCustomer,
    handleEditCustomer,
    handleSaveCustomer,
    handleSelectCustomer,
    handlePrintBill,
    updateTestStatus,
    assignTestToRepresentative,
    setIsEditingCustomer
  } = useLabBilling(setPendingTests, pendingTests);

  const {
    waitlistPatients,
    handleSelectWaitlistPatient
  } = useLabWaitlist(
    items => addItemToBill(items[0]), // We need to adapt this since setBillItems expects a setter function
    handleSelectCustomer,
    handleSearchCustomer,
    customersState
  );

  const {
    getRepresentativeAnalytics,
    getAcquisitionAnalytics
  } = useLabAnalytics(pendingTests, completedTests);

  return (
    <LabContext.Provider
      value={{
        pendingTests,
        completedTests,
        selectedTest,
        billItems,
        selectedCustomer,
        searchTerm,
        handleSelectTest,
        handleUploadResult,
        handleCreateReport,
        addItemToBill,
        updateItemQuantity,
        removeItem,
        calculateSubtotal,
        handleSearchCustomer,
        handleAddNewCustomer,
        handleSelectCustomer,
        handlePrintBill,
        labTestOptions,
        customers: customersState,
        handleEditCustomer,
        handleSaveCustomer,
        isEditingCustomer,
        setIsEditingCustomer,
        assignTestToRepresentative,
        waitlistPatients,
        handleSelectWaitlistPatient,
        updateTestStatus,
        updateTestWorkflow,
        updateSampleDetails,
        setupHomeCollection,
        getRepresentativeAnalytics,
        getAcquisitionAnalytics
      }}
    >
      {children}
    </LabContext.Provider>
  );
};

export const useLabContext = () => {
  const context = useContext(LabContext);
  if (context === undefined) {
    throw new Error("useLabContext must be used within a LabProvider");
  }
  return context;
};
