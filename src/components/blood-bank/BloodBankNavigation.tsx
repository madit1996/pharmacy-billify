
import { Droplet, Users, ClipboardList, Calendar, BarChart2, Database } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BloodBankNavigationProps {
  activeTab: 'inventory' | 'donors' | 'requests' | 'camps' | 'analytics' | 'stock';
  setActiveTab: (tab: 'inventory' | 'donors' | 'requests' | 'camps' | 'analytics' | 'stock') => void;
}

const BloodBankNavigation = ({ activeTab, setActiveTab }: BloodBankNavigationProps) => {
  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
      <TabsList className="grid grid-cols-6">
        <TabsTrigger value="inventory" className="flex items-center gap-1">
          <Droplet className="h-4 w-4 mr-1" />
          <span className="hidden md:inline">Inventory</span>
          <span className="inline md:hidden">
            <Droplet className="h-4 w-4" />
          </span>
        </TabsTrigger>
        
        <TabsTrigger value="stock" className="flex items-center gap-1">
          <Database className="h-4 w-4 mr-1" />
          <span className="hidden md:inline">Stock</span>
          <span className="inline md:hidden">
            <Database className="h-4 w-4" />
          </span>
        </TabsTrigger>
        
        <TabsTrigger value="donors" className="flex items-center gap-1">
          <Users className="h-4 w-4 mr-1" />
          <span className="hidden md:inline">Donors</span>
          <span className="inline md:hidden">
            <Users className="h-4 w-4" />
          </span>
        </TabsTrigger>
        
        <TabsTrigger value="requests" className="flex items-center gap-1">
          <ClipboardList className="h-4 w-4 mr-1" />
          <span className="hidden md:inline">Requests</span>
          <span className="inline md:hidden">
            <ClipboardList className="h-4 w-4" />
          </span>
        </TabsTrigger>
        
        <TabsTrigger value="camps" className="flex items-center gap-1">
          <Calendar className="h-4 w-4 mr-1" />
          <span className="hidden md:inline">Camps</span>
          <span className="inline md:hidden">
            <Calendar className="h-4 w-4" />
          </span>
        </TabsTrigger>
        
        <TabsTrigger value="analytics" className="flex items-center gap-1">
          <BarChart2 className="h-4 w-4 mr-1" />
          <span className="hidden md:inline">Analytics</span>
          <span className="inline md:hidden">
            <BarChart2 className="h-4 w-4" />
          </span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default BloodBankNavigation;
