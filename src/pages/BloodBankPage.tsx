
import { useState } from "react";
import BloodBankNavigation from "@/components/blood-bank/BloodBankNavigation";
import BloodInventoryTab from "@/components/blood-bank/BloodInventoryTab";
import BloodDonorsTab from "@/components/blood-bank/BloodDonorsTab";
import BloodRequestsTab from "@/components/blood-bank/BloodRequestsTab";
import BloodDonationCampTab from "@/components/blood-bank/BloodDonationCampTab";
import BloodAnalyticsTab from "@/components/blood-bank/BloodAnalyticsTab";
import BloodStockManagementTab from "@/components/blood-bank/BloodStockManagementTab";
import { BloodBankProvider } from "@/contexts/BloodBankContext";
import { Card, CardContent } from "@/components/ui/card";
import { QuickActions } from "@/components/blood-bank/QuickActions";

const BloodBankPage = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'donors' | 'requests' | 'camps' | 'analytics' | 'stock'>('inventory');

  return (
    <BloodBankProvider>
      <div className="container mx-auto pb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Blood Bank Management</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Quick action panel on the left */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <QuickActions activeTab={activeTab} setActiveTab={setActiveTab} />
              </CardContent>
            </Card>
          </div>
          
          {/* Main content area */}
          <div className="lg:col-span-3">
            <Card className="mb-4">
              <CardContent className="p-0">
                <BloodBankNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                {activeTab === 'inventory' && <BloodInventoryTab />}
                {activeTab === 'donors' && <BloodDonorsTab />}
                {activeTab === 'requests' && <BloodRequestsTab />}
                {activeTab === 'camps' && <BloodDonationCampTab />}
                {activeTab === 'analytics' && <BloodAnalyticsTab />}
                {activeTab === 'stock' && <BloodStockManagementTab />}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </BloodBankProvider>
  );
};

export default BloodBankPage;
