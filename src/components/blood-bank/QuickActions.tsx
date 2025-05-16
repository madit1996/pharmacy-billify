
import React from "react";
import { Button } from "@/components/ui/button";
import { Droplet, TransferIcon, AlertTriangle, UserPlus, ClipboardCheck, Calendar } from "lucide-react";
import { useBloodBankContext } from "@/contexts/BloodBankContext";

interface QuickActionsProps {
  activeTab: 'inventory' | 'donors' | 'requests' | 'camps' | 'analytics' | 'stock';
  setActiveTab: (tab: 'inventory' | 'donors' | 'requests' | 'camps' | 'analytics' | 'stock') => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ activeTab, setActiveTab }) => {
  const { inventory } = useBloodBankContext();
  const [isTransferDialogOpen, setIsTransferDialogOpen] = React.useState(false);

  // Critical levels check
  const criticalLevels = inventory.filter(item => item.available <= 3);
  const hasCriticalLevels = criticalLevels.length > 0;
  
  return (
    <div className="space-y-4">
      {hasCriticalLevels && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
            <div>
              <h4 className="font-semibold text-red-800">Critical Stock Alert</h4>
              <p className="text-sm text-red-600 mb-2">
                {criticalLevels.length} blood group{criticalLevels.length > 1 ? 's are' : ' is'} at critical levels
              </p>
              <Button 
                size="sm" 
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => setActiveTab('stock')}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-2">
        <Button 
          variant={activeTab === 'inventory' ? "default" : "outline"} 
          className="justify-start"
          onClick={() => setActiveTab('inventory')}
        >
          <Droplet className="h-4 w-4 mr-2" />
          View Inventory
        </Button>
        
        <Button 
          variant={activeTab === 'stock' ? "default" : "outline"} 
          className="justify-start"
          onClick={() => setActiveTab('stock')}
        >
          <TransferIcon className="h-4 w-4 mr-2" />
          Manage Stock
        </Button>
        
        <Button 
          variant={activeTab === 'donors' ? "default" : "outline"} 
          className="justify-start"
          onClick={() => setActiveTab('donors')}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Manage Donors
        </Button>
        
        <Button 
          variant={activeTab === 'requests' ? "default" : "outline"} 
          className="justify-start"
          onClick={() => setActiveTab('requests')}
        >
          <ClipboardCheck className="h-4 w-4 mr-2" />
          Manage Requests
        </Button>
        
        <Button 
          variant={activeTab === 'camps' ? "default" : "outline"} 
          className="justify-start"
          onClick={() => setActiveTab('camps')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Manage Camps
        </Button>
      </div>
      
      <div className="border-t border-gray-200 pt-4 mt-4">
        <h3 className="text-sm font-semibold mb-2">Stock Statistics</h3>
        <div className="grid grid-cols-1 gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Available:</span>
            <span className="font-medium">{inventory.reduce((sum, item) => sum + item.available, 0)} units</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Reserved:</span>
            <span className="font-medium">{inventory.reduce((sum, item) => sum + item.reserved, 0)} units</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Critical Levels:</span>
            <span className="font-medium text-red-600">{criticalLevels.length} groups</span>
          </div>
        </div>
      </div>
    </div>
  );
};
