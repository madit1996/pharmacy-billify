
import { CreditCard, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PharmacyNavigationProps {
  activeTab: 'analytics' | 'billing';
  setActiveTab: (tab: 'analytics' | 'billing') => void;
}

const PharmacyNavigation = ({ activeTab, setActiveTab }: PharmacyNavigationProps) => {
  return (
    <div className="flex gap-3">
      {activeTab !== 'analytics' && (
        <Button 
          variant="outline"
          onClick={() => setActiveTab('analytics')}
          className="flex items-center gap-1 border-blue-500 text-blue-600 hover:bg-blue-50"
        >
          <BarChart2 className="h-4 w-4 mr-1" />
          Analytics
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
      
      {activeTab === 'analytics' && (
        <Button 
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white"
          disabled
        >
          <BarChart2 className="h-4 w-4 mr-1" />
          Analytics
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
    </div>
  );
};

export default PharmacyNavigation;
