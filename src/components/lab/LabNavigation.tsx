
import { CreditCard, FileText, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface LabNavigationProps {
  activeTab: 'analytics' | 'billing' | 'tests';
  setActiveTab: (tab: 'analytics' | 'billing' | 'tests') => void;
}

const LabNavigation = ({ activeTab, setActiveTab }: LabNavigationProps) => {
  return (
    <div className="flex gap-3">
      {/* Analytics Tab */}
      {activeTab !== 'analytics' ? (
        <Button 
          variant="outline"
          onClick={() => setActiveTab('analytics')}
          className="flex items-center gap-1 border-blue-500 text-blue-600 hover:bg-blue-50"
        >
          <FileText className="h-4 w-4 mr-1" />
          Analytics
        </Button>
      ) : (
        <Button 
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white"
          disabled
        >
          <FileText className="h-4 w-4 mr-1" />
          Analytics
        </Button>
      )}
      
      {/* Billing Tab */}
      {activeTab !== 'billing' ? (
        <Button 
          variant="outline"
          onClick={() => setActiveTab('billing')}
          className="flex items-center gap-1 border-green-500 text-green-600 hover:bg-green-50"
        >
          <CreditCard className="h-4 w-4 mr-1" />
          Billing
        </Button>
      ) : (
        <Button 
          className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white"
          disabled
        >
          <CreditCard className="h-4 w-4 mr-1" />
          Billing
        </Button>
      )}
      
      {/* Tests Tab */}
      {activeTab !== 'tests' ? (
        <Button 
          variant="outline"
          onClick={() => setActiveTab('tests')}
          className="flex items-center gap-1 border-purple-500 text-purple-600 hover:bg-purple-50"
        >
          <FlaskConical className="h-4 w-4 mr-1" />
          Test Reports
        </Button>
      ) : (
        <Button 
          className="flex items-center gap-1 bg-purple-600 hover:bg-purple-700 text-white"
          disabled
        >
          <FlaskConical className="h-4 w-4 mr-1" />
          Test Reports
        </Button>
      )}
      
      {/* Billing History Link */}
      <Link to="/billing-history">
        <Button 
          variant="outline" 
          className="flex items-center gap-1 border-amber-500 text-amber-600 hover:bg-amber-50"
        >
          <CreditCard className="h-4 w-4 mr-1" />
          Billing History
        </Button>
      </Link>
    </div>
  );
};

export default LabNavigation;
