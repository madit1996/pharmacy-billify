
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, MapPin, Clock, User } from "lucide-react";
import AmbulanceRequestsTab from "@/components/ambulance/AmbulanceRequestsTab";
import DriverVehicleTab from "@/components/ambulance/DriverVehicleTab";
import DispatchTrackingTab from "@/components/ambulance/DispatchTrackingTab";

const AmbulanceDispatchPage = () => {
  const [activeTab, setActiveTab] = useState("requests");

  const ambulanceStats = {
    activeRequests: 5,
    availableVehicles: 8,
    onRoute: 3,
    completedToday: 12
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Ambulance Dispatch</h1>
          <p className="text-gray-600">Manage ambulance requests, vehicles, and dispatch tracking</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Requests</p>
                <p className="text-2xl font-bold text-red-600">{ambulanceStats.activeRequests}</p>
              </div>
              <Clock className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Vehicles</p>
                <p className="text-2xl font-bold text-green-600">{ambulanceStats.availableVehicles}</p>
              </div>
              <Truck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">On Route</p>
                <p className="text-2xl font-bold text-orange-600">{ambulanceStats.onRoute}</p>
              </div>
              <MapPin className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-blue-600">{ambulanceStats.completedToday}</p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requests">Ambulance Requests</TabsTrigger>
          <TabsTrigger value="vehicles">Driver & Vehicles</TabsTrigger>
          <TabsTrigger value="tracking">Dispatch Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <AmbulanceRequestsTab />
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-4">
          <DriverVehicleTab />
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <DispatchTrackingTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AmbulanceDispatchPage;
