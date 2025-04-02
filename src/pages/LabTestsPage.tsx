
import { useState } from "react";
import { LabProvider } from "@/contexts/LabContext";
import LabAnalyticsTab from "@/components/lab/LabAnalyticsTab";
import LabBillingTab from "@/components/lab/LabBillingTab";
import LabNavigation from "@/components/lab/LabNavigation";
import LabTestsTab from "@/components/lab/LabTestsTab";

const LabTestsPage = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'billing' | 'tests'>('analytics');

  return (
    <LabProvider>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Laboratory Services</h1>
          <LabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        {activeTab === 'analytics' && <LabAnalyticsTab />}
        {activeTab === 'billing' && <LabBillingTab />}
        {activeTab === 'tests' && <LabTestsTab />}
      </div>
    </LabProvider>
  );
};

export default LabTestsPage;
