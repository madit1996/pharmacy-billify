
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import LabNavigation from "@/components/lab/LabNavigation";
import LabAnalyticsTab from "@/components/lab/LabAnalyticsTab";
import LabTestsTab from "@/components/lab/LabTestsTab";
import LabBillingTab from "@/components/lab/LabBillingTab";
import { LabProvider } from "@/contexts/LabContext";
import LabWorkflowPanel from "@/components/lab/LabWorkflowPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LabTestsPage = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'tests' | 'billing' | 'tracking'>('analytics');

  // This function ensures we handle all possible tab values
  const handleTabChange = (tab: 'analytics' | 'tests' | 'billing' | 'tracking') => {
    setActiveTab(tab);
  };

  return (
    <LabProvider>
      <div className="flex flex-col h-screen overflow-hidden">
        <div className="bg-white border-b p-4 flex justify-between items-center">
          <Link to="/">
            <Button variant="ghost" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Button>
          </Link>
          
          <h1 className="text-xl font-semibold text-center flex-1">Lab Management</h1>
          
          <LabNavigation activeTab={activeTab} setActiveTab={handleTabChange} />
        </div>
        
        <div className="flex-1 overflow-hidden flex">
          {/* Main content */}
          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            {activeTab === 'analytics' && <LabAnalyticsTab />}
            {activeTab === 'tests' && <LabTestsTab />}
            {activeTab === 'billing' && <LabBillingTab />}
            {/* We can add the tracking tab content when needed */}
            {activeTab === 'tracking' && <div>Test tracking content will be added here</div>}
          </div>
          
          {/* Workflow tracking panel - always visible */}
          <div className="w-96 border-l bg-white overflow-auto">
            <LabWorkflowPanel />
          </div>
        </div>
      </div>
    </LabProvider>
  );
};

export default LabTestsPage;
