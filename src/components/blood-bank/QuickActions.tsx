
import { Button } from "@/components/ui/button";
import { 
  Droplet, 
  Users, 
  ClipboardList, 
  Calendar, 
  BarChart2, 
  Database, 
  Plus
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useBloodBankContext } from "@/contexts/BloodBankContext";
import { useState } from "react";
import BloodUnitDialog from "./BloodUnitDialog";
import BloodDonorDialog from "./BloodDonorDialog";
import BloodRequestDialog from "./BloodRequestDialog";

type TabType = 'inventory' | 'donors' | 'requests' | 'camps' | 'analytics' | 'stock';

interface QuickActionsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export function QuickActions({ activeTab, setActiveTab }: QuickActionsProps) {
  const { inventory } = useBloodBankContext();
  const [addBloodUnitOpen, setAddBloodUnitOpen] = useState(false);
  const [addDonorOpen, setAddDonorOpen] = useState(false);
  const [addRequestOpen, setAddRequestOpen] = useState(false);
  
  // Find critical stock levels
  const criticalStock = inventory.filter(item => item.available <= 3);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500">Common Tasks</h3>
        <Button 
          variant="default" 
          className="w-full justify-start bg-red-600 hover:bg-red-700"
          onClick={() => setAddBloodUnitOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Blood Unit
        </Button>
        
        <Button 
          variant="default" 
          className="w-full justify-start bg-blue-600 hover:bg-blue-700"
          onClick={() => setAddDonorOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Register Donor
        </Button>
        
        <Button 
          variant="default" 
          className="w-full justify-start bg-green-600 hover:bg-green-700"
          onClick={() => setAddRequestOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Blood Request
        </Button>
      </div>

      <Separator />

      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-500">Navigation</h3>
        <div className="space-y-1">
          <Button 
            variant={activeTab === 'inventory' ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab('inventory')}
          >
            <Droplet className="mr-2 h-4 w-4" />
            Blood Inventory
          </Button>
          
          <Button 
            variant={activeTab === 'stock' ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab('stock')}
          >
            <Database className="mr-2 h-4 w-4" />
            Stock Management
          </Button>
          
          <Button 
            variant={activeTab === 'donors' ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab('donors')}
          >
            <Users className="mr-2 h-4 w-4" />
            Donors
          </Button>
          
          <Button 
            variant={activeTab === 'requests' ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab('requests')}
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            Blood Requests
          </Button>
          
          <Button 
            variant={activeTab === 'camps' ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab('camps')}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Donation Camps
          </Button>
          
          <Button 
            variant={activeTab === 'analytics' ? "secondary" : "ghost"} 
            className="w-full justify-start"
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart2 className="mr-2 h-4 w-4" />
            Analytics
          </Button>
        </div>
      </div>

      {criticalStock.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-red-500">Critical Alerts</h3>
            <div className="space-y-2">
              {criticalStock.map(item => (
                <div 
                  key={item.bloodGroup}
                  className="bg-red-50 border border-red-200 rounded-md p-2 text-sm"
                >
                  <p className="font-medium text-red-700">{item.bloodGroup}: Critical</p>
                  <p className="text-red-600 text-xs">Only {item.available} units left</p>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full justify-center border-red-500 text-red-600 hover:bg-red-50"
                onClick={() => setActiveTab('stock')}
              >
                View Critical Stock
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Dialogs */}
      {addBloodUnitOpen && (
        <BloodUnitDialog 
          open={addBloodUnitOpen}
          onOpenChange={setAddBloodUnitOpen}
          bloodUnit={null}
        />
      )}
      
      {addDonorOpen && (
        <BloodDonorDialog 
          open={addDonorOpen}
          onOpenChange={setAddDonorOpen}
          donor={null}
        />
      )}
      
      {addRequestOpen && (
        <BloodRequestDialog 
          open={addRequestOpen}
          onOpenChange={setAddRequestOpen}
          bloodRequest={null}
        />
      )}
    </div>
  );
}
