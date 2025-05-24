
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, FileText, ShoppingCart, ClipboardCheck } from "lucide-react";
import ItemInventoryTab from "@/components/material-store/ItemInventoryTab";
import DepartmentIssueTab from "@/components/material-store/DepartmentIssueTab";
import PurchaseOrderTab from "@/components/material-store/PurchaseOrderTab";
import GRNTab from "@/components/material-store/GRNTab";

const MaterialStorePage = () => {
  const [activeTab, setActiveTab] = useState("inventory");

  const storeStats = {
    totalItems: 1250,
    lowStock: 45,
    pendingOrders: 8,
    recentGRNs: 12
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Material Store Management</h1>
          <p className="text-gray-600">Manage inventory, purchase orders, and department issues</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold">{storeStats.totalItems}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-red-600">{storeStats.lowStock}</p>
              </div>
              <Package className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-orange-600">{storeStats.pendingOrders}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recent GRNs</p>
                <p className="text-2xl font-bold text-green-600">{storeStats.recentGRNs}</p>
              </div>
              <ClipboardCheck className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="inventory">Item Inventory</TabsTrigger>
          <TabsTrigger value="issues">Department Issues</TabsTrigger>
          <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="grn">GRN Records</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <ItemInventoryTab />
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <DepartmentIssueTab />
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <PurchaseOrderTab />
        </TabsContent>

        <TabsContent value="grn" className="space-y-4">
          <GRNTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MaterialStorePage;
