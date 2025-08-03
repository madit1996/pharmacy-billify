import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Pill,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Package
} from "lucide-react";
import { Order, PrescriptionOrderDetails } from "@/types/order-types";
import { format } from "date-fns";

// Mock prescription orders from doctors
const mockPrescriptionOrders: Order[] = [
  {
    id: "PRX001",
    type: "prescription",
    patientId: "PAT-18",
    patientName: "Priya Jain",
    appointmentId: "72",
    doctorId: "DOC-01",
    doctorName: "Dr. Kartik",
    orderDate: new Date("2025-07-25T17:15:00"),
    status: "pending",
    priority: "normal",
    department: "OPD",
    targetDepartment: "Pharmacy",
    description: "Paracetamol 500mg, Amoxicillin 250mg",
    estimatedCompletionTime: new Date("2025-07-25T18:30:00"),
    orderDetails: {
      medications: [
        { name: "Paracetamol", dosage: "500mg", frequency: "Twice daily", duration: "5 days", quantity: 10 },
        { name: "Amoxicillin", dosage: "250mg", frequency: "Three times daily", duration: "7 days", quantity: 21 }
      ],
      totalAmount: 450,
      paymentStatus: "pending"
    } as PrescriptionOrderDetails
  },
  {
    id: "PRX002", 
    type: "prescription",
    patientId: "PAT-17",
    patientName: "Aditya Mahajan",
    appointmentId: "68",
    doctorId: "DOC-01",
    doctorName: "Dr. Kartik",
    orderDate: new Date("2025-07-25T13:00:00"),
    status: "acknowledged",
    priority: "high",
    department: "OPD",
    targetDepartment: "Pharmacy",
    description: "Insulin, Blood glucose strips",
    estimatedCompletionTime: new Date("2025-07-25T14:00:00"),
    orderDetails: {
      medications: [
        { name: "Insulin Pen", dosage: "10 units", frequency: "Before meals", duration: "30 days", quantity: 3 },
        { name: "Blood Glucose Strips", dosage: "1 strip", frequency: "As needed", duration: "30 days", quantity: 50 }
      ],
      totalAmount: 1200,
      paymentStatus: "pending"
    } as PrescriptionOrderDetails
  }
];

const DoctorOrdersPharmacyTab = () => {
  const [activeTab, setActiveTab] = useState("pending");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'acknowledged':
        return <Badge className="bg-blue-100 text-blue-800">Acknowledged</Badge>;
      case 'in-progress':
        return <Badge className="bg-orange-100 text-orange-800">Preparing</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Ready</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'normal':
        return <Badge variant="outline">Normal</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    console.log(`Updating order ${orderId} to ${newStatus}`);
    // In real implementation, this would update the order status
  };

  const ordersByStatus = {
    pending: mockPrescriptionOrders.filter(order => order.status === 'pending'),
    acknowledged: mockPrescriptionOrders.filter(order => order.status === 'acknowledged'),
    preparing: mockPrescriptionOrders.filter(order => order.status === 'in-progress'),
    ready: mockPrescriptionOrders.filter(order => order.status === 'completed')
  };

  const stats = {
    total: mockPrescriptionOrders.length,
    pending: ordersByStatus.pending.length,
    acknowledged: ordersByStatus.acknowledged.length,
    preparing: ordersByStatus.preparing.length,
    ready: ordersByStatus.ready.length
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Acknowledged
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{stats.acknowledged}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Ready
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{stats.ready}</p>
          </CardContent>
        </Card>
      </div>

      {/* Doctor Prescription Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Doctor Prescription Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
              <TabsTrigger value="acknowledged">Acknowledged ({stats.acknowledged})</TabsTrigger>
              <TabsTrigger value="preparing">Preparing ({stats.preparing})</TabsTrigger>
              <TabsTrigger value="ready">Ready ({stats.ready})</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-6">
              <div className="space-y-4">
                {ordersByStatus.pending.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Pill className="h-5 w-5 text-blue-600" />
                          <div>
                            <h4 className="font-medium">Order #{order.id}</h4>
                            <p className="text-sm text-muted-foreground">
                              {order.patientName} • {order.doctorName} • {format(order.orderDate, "PPp")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getPriorityBadge(order.priority)}
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="font-medium mb-2">Medications:</h5>
                        <div className="space-y-2">
                          {(order.orderDetails as PrescriptionOrderDetails).medications.map((med, index) => (
                            <div key={index} className="flex justify-between items-center text-sm bg-muted/30 p-2 rounded">
                              <span>{med.name} - {med.dosage}</span>
                              <span className="text-muted-foreground">{med.frequency} × {med.quantity}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 pt-2 border-t flex justify-between font-medium">
                          <span>Total Amount:</span>
                          <span>₹{(order.orderDetails as PrescriptionOrderDetails).totalAmount}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'acknowledged')}>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Acknowledge
                        </Button>
                        <Button size="sm" variant="outline">
                          <Package className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {ordersByStatus.pending.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No pending prescription orders
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="acknowledged" className="mt-6">
              <div className="space-y-4">
                {ordersByStatus.acknowledged.map((order) => (
                  <Card key={order.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Pill className="h-5 w-5 text-blue-600" />
                          <div>
                            <h4 className="font-medium">Order #{order.id}</h4>
                            <p className="text-sm text-muted-foreground">
                              {order.patientName} • {order.doctorName} • {format(order.orderDate, "PPp")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getPriorityBadge(order.priority)}
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="font-medium mb-2">Medications:</h5>
                        <div className="space-y-2">
                          {(order.orderDetails as PrescriptionOrderDetails).medications.map((med, index) => (
                            <div key={index} className="flex justify-between items-center text-sm bg-muted/30 p-2 rounded">
                              <span>{med.name} - {med.dosage}</span>
                              <span className="text-muted-foreground">{med.frequency} × {med.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdateStatus(order.id, 'in-progress')}>
                          <Package className="h-3 w-3 mr-1" />
                          Start Preparing
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {ordersByStatus.acknowledged.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No acknowledged orders
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="preparing" className="mt-6">
              <div className="text-center py-8 text-muted-foreground">
                No orders currently being prepared
              </div>
            </TabsContent>

            <TabsContent value="ready" className="mt-6">
              <div className="text-center py-8 text-muted-foreground">
                No orders ready for pickup
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorOrdersPharmacyTab;