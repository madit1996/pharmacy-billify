
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Quick Access</h2>
          <div className="space-y-3">
            <Button 
              className="w-full bg-pharmacy-primary hover:bg-pharmacy-primary/90"
              onClick={() => navigate('/pharmacy')}
            >
              Go to Pharmacy
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/patients')}
            >
              View Patients
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
          <div className="space-y-2">
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm">New prescription filled for John Doe</p>
              <p className="text-xs text-gray-500">10 minutes ago</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm">Inventory updated: Sanmol Tablets</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Total Sales Today</span>
              <span className="font-medium">$1,245.50</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Pending Orders</span>
              <span className="font-medium">8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Low Stock Items</span>
              <span className="font-medium text-amber-600">12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
