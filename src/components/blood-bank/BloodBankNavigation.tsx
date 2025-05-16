
import { Droplet, Users, ClipboardList, Calendar, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BloodBankNavigationProps {
  activeTab: 'inventory' | 'donors' | 'requests' | 'camps' | 'analytics';
  setActiveTab: (tab: 'inventory' | 'donors' | 'requests' | 'camps' | 'analytics') => void;
}

const BloodBankNavigation = ({ activeTab, setActiveTab }: BloodBankNavigationProps) => {
  return (
    <div className="flex gap-3">
      {activeTab !== 'inventory' && (
        <Button 
          variant="outline"
          onClick={() => setActiveTab('inventory')}
          className="flex items-center gap-1 border-red-500 text-red-600 hover:bg-red-50"
        >
          <Droplet className="h-4 w-4 mr-1" />
          Inventory
        </Button>
      )}
      
      {activeTab !== 'donors' && (
        <Button 
          variant="outline"
          onClick={() => setActiveTab('donors')}
          className="flex items-center gap-1 border-blue-500 text-blue-600 hover:bg-blue-50"
        >
          <Users className="h-4 w-4 mr-1" />
          Donors
        </Button>
      )}
      
      {activeTab !== 'requests' && (
        <Button 
          variant="outline"
          onClick={() => setActiveTab('requests')}
          className="flex items-center gap-1 border-green-500 text-green-600 hover:bg-green-50"
        >
          <ClipboardList className="h-4 w-4 mr-1" />
          Requests
        </Button>
      )}

      {activeTab !== 'camps' && (
        <Button 
          variant="outline"
          onClick={() => setActiveTab('camps')}
          className="flex items-center gap-1 border-amber-500 text-amber-600 hover:bg-amber-50"
        >
          <Calendar className="h-4 w-4 mr-1" />
          Donation Camps
        </Button>
      )}

      {activeTab !== 'analytics' && (
        <Button 
          variant="outline"
          onClick={() => setActiveTab('analytics')}
          className="flex items-center gap-1 border-purple-500 text-purple-600 hover:bg-purple-50"
        >
          <BarChart2 className="h-4 w-4 mr-1" />
          Analytics
        </Button>
      )}
      
      {activeTab === 'inventory' && (
        <Button 
          className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white"
          disabled
        >
          <Droplet className="h-4 w-4 mr-1" />
          Inventory
        </Button>
      )}
      
      {activeTab === 'donors' && (
        <Button 
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white"
          disabled
        >
          <Users className="h-4 w-4 mr-1" />
          Donors
        </Button>
      )}
      
      {activeTab === 'requests' && (
        <Button 
          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white"
          disabled
        >
          <ClipboardList className="h-4 w-4 mr-1" />
          Requests
        </Button>
      )}

      {activeTab === 'camps' && (
        <Button 
          className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white"
          disabled
        >
          <Calendar className="h-4 w-4 mr-1" />
          Donation Camps
        </Button>
      )}

      {activeTab === 'analytics' && (
        <Button 
          className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white"
          disabled
        >
          <BarChart2 className="h-4 w-4 mr-1" />
          Analytics
        </Button>
      )}
    </div>
  );
};

export default BloodBankNavigation;
