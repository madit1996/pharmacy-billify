
import { CreditCard, FileText, ChevronRight, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface LabNavigationProps {
  activeTab: 'analytics' | 'billing' | 'tests';
  setActiveTab: (tab: 'analytics' | 'billing' | 'tests') => void;
}

const LabNavigation = ({ activeTab, setActiveTab }: LabNavigationProps) => {
  return (
    <div className="flex gap-3">
      {activeTab !== 'analytics' && (
        <Button 
          variant="outline"
          onClick={() => setActiveTab('analytics')}
          className="flex items-center gap-1"
        >
          <FileText className="h-4 w-4 mr-1" />
          Analytics & Management
        </Button>
      )}
      
      {activeTab !== 'billing' && (
        <Button 
          variant="outline"
          onClick={() => setActiveTab('billing')}
          className="flex items-center gap-1"
        >
          <CreditCard className="h-4 w-4 mr-1" />
          Billing
        </Button>
      )}
      
      {activeTab !== 'tests' && (
        <Button 
          variant="outline"
          onClick={() => setActiveTab('tests')}
          className="flex items-center gap-1"
        >
          <FlaskConical className="h-4 w-4 mr-1" />
          Test Reports
        </Button>
      )}
      
      <Link to="/billing-history">
        <Button className="flex items-center gap-1">
          <CreditCard className="h-4 w-4 mr-1" />
          Billing History
          <ChevronRight className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
};

export default LabNavigation;
