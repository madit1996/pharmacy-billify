
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BloodBankNavigation from "@/components/blood-bank/BloodBankNavigation";
import BloodInventoryTab from "@/components/blood-bank/BloodInventoryTab";
import BloodDonorsTab from "@/components/blood-bank/BloodDonorsTab";
import BloodRequestsTab from "@/components/blood-bank/BloodRequestsTab";
import BloodDonationCampTab from "@/components/blood-bank/BloodDonationCampTab";
import BloodAnalyticsTab from "@/components/blood-bank/BloodAnalyticsTab";
import { BloodBankProvider } from "@/contexts/BloodBankContext";

const BloodBankPage = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'donors' | 'requests' | 'camps' | 'analytics'>('inventory');

  return (
    <BloodBankProvider>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Blood Bank Management</h1>
          <BloodBankNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'inventory' && <BloodInventoryTab />}
          {activeTab === 'donors' && <BloodDonorsTab />}
          {activeTab === 'requests' && <BloodRequestsTab />}
          {activeTab === 'camps' && <BloodDonationCampTab />}
          {activeTab === 'analytics' && <BloodAnalyticsTab />}
        </div>
      </div>
    </BloodBankProvider>
  );
};

export default BloodBankPage;
