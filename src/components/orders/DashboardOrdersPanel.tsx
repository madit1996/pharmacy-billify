import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Search,
  CreditCard,
  User,
  MapPin,
  Phone
} from "lucide-react";
import { Order, OrderType } from "@/types/order-types";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface DashboardOrdersPanelProps {
  department: 'Lab' | 'Pharmacy' | 'Blood Bank';
  orders: Order[];
  onQuickBill?: (order: Order) => void;
  onUpdateStatus?: (orderId: string, status: string) => void;
}

const DashboardOrdersPanel = ({ department, orders, onQuickBill, onUpdateStatus }: DashboardOrdersPanelProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const { toast } = useToast();

  // Filter orders by department and status
  const filteredOrders = orders.filter(order => {
    const matchesDepartment = order.targetDepartment === department;
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch = searchTerm === "" || 
      order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDepartment && matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'acknowledged':
        return <Badge className="bg-blue-100 text-blue-800">Acknowledged</Badge>;
      case 'in-progress':
        return <Badge className="bg-orange-100 text-orange-800">Processing</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Ready</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPriorityIcon = (priority: string) => {
    if (priority === 'urgent' || priority === 'high') {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    return <Clock className="h-4 w-4 text-gray-400" />;
  };

  const handleQuickAction = (order: Order, action: string) => {
    if (action === 'acknowledge' && onUpdateStatus) {
      onUpdateStatus(order.id, 'acknowledged');
      toast({
        title: "Order Acknowledged",
        description: `Order ${order.id} has been acknowledged`,
      });
    } else if (action === 'process' && onUpdateStatus) {
      onUpdateStatus(order.id, 'in-progress');
      toast({
        title: "Processing Started",
        description: `Processing order ${order.id}`,
      });
    } else if (action === 'complete' && onUpdateStatus) {
      onUpdateStatus(order.id, 'completed');
      toast({
        title: "Order Completed",
        description: `Order ${order.id} is ready`,
      });
    } else if (action === 'bill' && onQuickBill) {
      onQuickBill(order);
    }
  };

  const getOrderStats = () => {
    const departmentOrders = orders.filter(o => o.targetDepartment === department);
    return {
      pending: departmentOrders.filter(o => o.status === 'pending').length,
      processing: departmentOrders.filter(o => o.status === 'acknowledged' || o.status === 'in-progress').length,
      ready: departmentOrders.filter(o => o.status === 'completed').length,
      urgent: departmentOrders.filter(o => o.priority === 'urgent' || o.priority === 'high').length
    };
  };

  const stats = getOrderStats();

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Doctor Orders - {department}</CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
              {stats.pending} Pending
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {stats.processing} Processing
            </Badge>
            {stats.urgent > 0 && (
              <Badge className="bg-red-100 text-red-800">
                {stats.urgent} Urgent
              </Badge>
            )}
          </div>
        </div>
        
        {/* Quick Filters */}
        <div className="flex gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by patient, doctor, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending Only</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
              <SelectItem value="in-progress">Processing</SelectItem>
              <SelectItem value="completed">Ready</SelectItem>
              <SelectItem value="all">All Orders</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {filteredOrders.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No {statusFilter === 'all' ? '' : statusFilter} orders found</p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {filteredOrders.slice(0, 8).map((order) => (
                <Card key={order.id} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getPriorityIcon(order.priority)}
                        <span className="font-medium text-sm">#{order.id}</span>
                        {getStatusBadge(order.status)}
                        <span className="text-xs text-muted-foreground">
                          {format(order.orderDate, "MMM d, HH:mm")}
                        </span>
                      </div>
                      
                      <div className="space-y-1 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">{order.patientName}</span>
                          <span className="text-muted-foreground">•</span>
                          <span>{order.doctorName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{order.department}</span>
                        </div>
                        <p className="text-sm text-foreground">{order.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 ml-4">
                      {order.status === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleQuickAction(order, 'acknowledge')}
                          className="h-7 px-3 text-xs"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Acknowledge
                        </Button>
                      )}
                      
                      {order.status === 'acknowledged' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleQuickAction(order, 'process')}
                          className="h-7 px-3 text-xs bg-blue-600 hover:bg-blue-700"
                        >
                          Start Process
                        </Button>
                      )}
                      
                      {order.status === 'in-progress' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleQuickAction(order, 'complete')}
                          className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700"
                        >
                          Mark Ready
                        </Button>
                      )}
                      
                      {(order.status === 'completed' || order.status === 'in-progress') && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleQuickAction(order, 'bill')}
                          className="h-7 px-3 text-xs"
                        >
                          <CreditCard className="h-3 w-3 mr-1" />
                          Quick Bill
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              
              {filteredOrders.length > 8 && (
                <div className="pt-2 text-center">
                  <Button variant="outline" size="sm">
                    View All {filteredOrders.length} Orders
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardOrdersPanel;