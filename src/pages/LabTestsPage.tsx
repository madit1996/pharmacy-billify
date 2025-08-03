
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import LabNavigation from "@/components/lab/LabNavigation";
import LabAnalyticsTab from "@/components/lab/LabAnalyticsTab";
import LabTestsTab from "@/components/lab/LabTestsTab";
import LabBillingTab from "@/components/lab/LabBillingTab";
import LabTestTrackingTab from "@/components/lab/LabTestTrackingTab";
import DashboardOrdersPanel from "@/components/orders/DashboardOrdersPanel";
import { LabProvider } from "@/contexts/LabContext";
import { Order } from "@/types/order-types";

const LabTestsPage = () => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'tests' | 'billing' | 'tracking'>('analytics');

  // Mock lab orders data - in real app this would come from API
  const mockLabOrders: Order[] = [
    {
      id: "LAB001", type: "lab-test", patientId: "PAT-18", patientName: "Priya Jain",
      appointmentId: "72", doctorId: "DOC-01", doctorName: "Dr. Kartik",
      orderDate: new Date(), status: "pending", priority: "urgent", department: "OPD",
      targetDepartment: "Lab", description: "Complete Blood Count, Liver Function Test",
      orderDetails: { testNames: ["CBC", "LFT"], sampleType: "Blood", fasting: true }
    }
  ];

  const handleQuickBill = (order: Order) => {
    console.log("Quick billing for:", order.id);
  };

  const handleUpdateStatus = (orderId: string, status: string) => {
    console.log("Updating order", orderId, "to", status);
  };

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
        
        <div className="flex-1 overflow-hidden flex gap-4">
          {/* Main Content */}
          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            {activeTab === 'analytics' && <LabAnalyticsTab />}
            {activeTab === 'tests' && <LabTestsTab />}
            {activeTab === 'billing' && <LabBillingTab />}
            {activeTab === 'tracking' && <LabTestTrackingTab />}
          </div>
          
          {/* Doctor Orders Panel - Always Visible */}
          <div className="w-96 p-6">
            <DashboardOrdersPanel 
              department="Lab"
              orders={mockLabOrders}
              onQuickBill={handleQuickBill}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>
        </div>
      </div>
    </LabProvider>
  );
};

export default LabTestsPage;
