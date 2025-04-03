
import { CreditCard, BarChart2, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LabNavigationProps {
  activeTab: 'analytics' | 'tests' | 'billing' | 'tracking';
  setActiveTab: (tab: 'analytics' | 'tests' | 'billing' | 'tracking') => void;
}

const LabNavigation = ({ activeTab, setActiveTab }: LabNavigationProps) => {
  return (
    <div className="flex gap-3">
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
      
      {activeTab !== 'tests' && (
        <Button 
          variant="outline"
          onClick={() => setActiveTab('tests')}
          className="flex items-center gap-1 border-blue-500 text-blue-600 hover:bg-blue-50"
        >
          <Activity className="h-4 w-4 mr-1" />
          Tests
        </Button>
      )}
      
      {activeTab !== 'billing' && (
        <Button 
          variant="outline"
          onClick={() => setActiveTab('billing')}
          className="flex items-center gap-1 border-green-500 text-green-600 hover:bg-green-50"
        >
          <CreditCard className="h-4 w-4 mr-1" />
          Billing
        </Button>
      )}

      {activeTab !== 'tracking' && (
        <Button 
          variant="outline"
          onClick={() => setActiveTab('tracking')}
          className="flex items-center gap-1 border-amber-500 text-amber-600 hover:bg-amber-50"
        >
          <Activity className="h-4 w-4 mr-1" />
          Tracking
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
      
      {activeTab === 'tests' && (
        <Button 
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white"
          disabled
        >
          <Activity className="h-4 w-4 mr-1" />
          Tests
        </Button>
      )}
      
      {activeTab === 'billing' && (
        <Button 
          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white"
          disabled
        >
          <CreditCard className="h-4 w-4 mr-1" />
          Billing
        </Button>
      )}

      {activeTab === 'tracking' && (
        <Button 
          className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white"
          disabled
        >
          <Activity className="h-4 w-4 mr-1" />
          Tracking
        </Button>
      )}
    </div>
  );
};

export default LabNavigation;
