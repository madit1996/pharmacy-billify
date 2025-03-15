
import { CreditCard, FileText, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PharmacyNavigationProps {
  activeTab: 'analytics' | 'billing';
  setActiveTab: (tab: 'analytics' | 'billing') => void;
}

const PharmacyNavigation = ({ activeTab, setActiveTab }: PharmacyNavigationProps) => {
  return (
    <div className="flex gap-3">
      {activeTab !== 'billing' && (
        <Button 
          onClick={() => setActiveTab('billing')}
          className="flex items-center gap-1"
        >
          <CreditCard className="h-4 w-4 mr-1" />
          Billing
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
      {activeTab !== 'analytics' && (
        <Button 
          variant="outline"
          onClick={() => setActiveTab('analytics')}
          className="flex items-center gap-1"
        >
          <FileText className="h-4 w-4 mr-1" />
          Analytics
        </Button>
      )}
    </div>
  );
};

export default PharmacyNavigation;
