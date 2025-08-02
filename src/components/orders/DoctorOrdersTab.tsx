import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus,
  TestTube,
  Camera,
  Pill,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from "lucide-react";
import { Order, OrderType, OrderStatus } from "@/types/order-types";
import { format } from "date-fns";

interface DoctorOrdersTabProps {
  patientId: string;
}

// Mock orders data
const mockOrders: Order[] = [
  {
    id: "ORD001",
    type: "lab-test",
    patientId: "PAT-18",
    patientName: "Priya Jain",
    appointmentId: "72",
    doctorId: "DOC-01",
    doctorName: "Dr. Kartik",
    orderDate: new Date("2025-07-25T17:20:00"),
    status: "acknowledged",
    priority: "normal",
    department: "OPD",
    targetDepartment: "Lab",
    description: "Complete Blood Count, Liver Function Test",
    estimatedCompletionTime: new Date("2025-07-26T10:00:00"),
    orderDetails: {
      testNames: ["Complete Blood Count", "Liver Function Test"],
      sampleType: "Blood",
      fasting: true
    }
  },
  {
    id: "ORD002",
    type: "prescription",
    patientId: "PAT-18",
    patientName: "Priya Jain",
    appointmentId: "72",
    doctorId: "DOC-01",
    doctorName: "Dr. Kartik",
    orderDate: new Date("2025-07-25T17:15:00"),
    status: "completed",
    priority: "normal",
    department: "OPD",
    targetDepartment: "Pharmacy",
    description: "Paracetamol 500mg, Amoxicillin 250mg",
    completedAt: new Date("2025-07-25T18:30:00"),
    orderDetails: {
      medications: [
        { name: "Paracetamol", dosage: "500mg", frequency: "Twice daily", duration: "5 days", quantity: 10 },
        { name: "Amoxicillin", dosage: "250mg", frequency: "Three times daily", duration: "7 days", quantity: 21 }
      ],
      totalAmount: 450
    }
  },
  {
    id: "ORD003",
    type: "radiology-scan",
    patientId: "PAT-18",
    patientName: "Priya Jain",
    appointmentId: "71",
    doctorId: "DOC-01",
    doctorName: "Dr. Kartik",
    orderDate: new Date("2025-07-24T14:00:00"),
    status: "completed",
    priority: "high",
    department: "OPD",
    targetDepartment: "Radiology",
    description: "Chest X-Ray",
    completedAt: new Date("2025-07-24T16:30:00"),
    orderDetails: {
      scanType: "X-Ray",
      bodyPart: "Chest",
      contrast: false,
      clinicalHistory: "Chronic cough, rule out pneumonia"
    }
  },
  {
    id: "ORD004",
    type: "vaccination",
    patientId: "PAT-18",
    patientName: "Priya Jain",
    appointmentId: "70",
    doctorId: "DOC-02",
    doctorName: "Dr. Rajeev",
    orderDate: new Date("2025-07-20T10:30:00"),
    status: "completed",
    priority: "normal",
    department: "OPD",
    targetDepartment: "Vaccination Center",
    description: "COVID-19 Booster Dose",
    completedAt: new Date("2025-07-20T11:00:00"),
    orderDetails: {
      vaccineName: "COVID-19 mRNA Vaccine",
      doseNumber: 3,
      scheduledDate: new Date("2025-07-20T11:00:00"),
      location: "Vaccination Center"
    }
  }
];

const DoctorOrdersTab = ({ patientId }: DoctorOrdersTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");

  const orderTypes: { value: OrderType; label: string; icon: any }[] = [
    { value: 'lab-test', label: 'Lab Tests', icon: TestTube },
    { value: 'radiology-scan', label: 'Radiology', icon: Camera },
    { value: 'prescription', label: 'Prescriptions', icon: Pill },
    { value: 'vaccination', label: 'Vaccinations', icon: Shield }
  ];

  const getOrderIcon = (type: OrderType) => {
    const orderType = orderTypes.find(ot => ot.value === type);
    const IconComponent = orderType?.icon || TestTube;
    return <IconComponent className="h-4 w-4" />;
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'acknowledged':
        return <Badge className="bg-blue-100 text-blue-800">Acknowledged</Badge>;
      case 'in-progress':
        return <Badge className="bg-orange-100 text-orange-800">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
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
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  // Filter orders
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = searchTerm === "" || 
      order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.targetDepartment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "all" || order.type === selectedType;
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;

    // Tab filtering
    const matchesTab = activeTab === "all" || 
      (activeTab === "pending" && order.status === "pending") ||
      (activeTab === "in-progress" && (order.status === "acknowledged" || order.status === "in-progress")) ||
      (activeTab === "completed" && order.status === "completed");

    return matchesSearch && matchesType && matchesStatus && matchesTab;
  });

  const getOrderStats = () => {
    const total = mockOrders.length;
    const pending = mockOrders.filter(o => o.status === 'pending').length;
    const inProgress = mockOrders.filter(o => o.status === 'acknowledged' || o.status === 'in-progress').length;
    const completed = mockOrders.filter(o => o.status === 'completed').length;
    
    return { total, pending, inProgress, completed };
  };

  const stats = getOrderStats();

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
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Doctor's Order Tracker</CardTitle>
            <Button className="bg-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search orders by description or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Order Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {orderTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress ({stats.inProgress})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Type</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Target Dept</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Est. Completion</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getOrderIcon(order.type)}
                            <span className="text-sm font-medium capitalize">
                              {order.type.replace('-', ' ')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono font-medium">
                          {order.id}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {order.description}
                        </TableCell>
                        <TableCell>{order.targetDepartment}</TableCell>
                        <TableCell>{format(order.orderDate, "PPp")}</TableCell>
                        <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>
                          {order.estimatedCompletionTime ? 
                            format(order.estimatedCompletionTime, "PPP") : 
                            order.completedAt ? format(order.completedAt, "PPP") : "N/A"
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                            {order.status === 'pending' && (
                              <Button size="sm" variant="outline">
                                Cancel
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredOrders.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No orders found matching your criteria</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorOrdersTab;