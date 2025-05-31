
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Globe, 
  Store, 
  Clock, 
  CheckCircle, 
  Truck, 
  Package,
  Phone,
  MapPin,
  CreditCard
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OnlineOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  platform: string;
  orderTime: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'dispatched' | 'delivered';
  paymentMethod: string;
  deliveryType: 'pickup' | 'delivery';
}

const OnlineOrdersDialog = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  
  const [onlineOrders] = useState<OnlineOrder[]>([
    {
      id: "ON001",
      customerName: "Rajesh Kumar",
      customerPhone: "+91-9876543210",
      customerAddress: "123 Main Street, Delhi",
      platform: "Website",
      orderTime: "10:30 AM",
      items: [
        { name: "Paracetamol 500mg", quantity: 2, price: 25 },
        { name: "Vitamin C", quantity: 1, price: 150 }
      ],
      total: 200,
      status: 'pending',
      paymentMethod: "UPI",
      deliveryType: 'delivery'
    },
    {
      id: "ON002",
      customerName: "Priya Sharma",
      customerPhone: "+91-9876543211",
      customerAddress: "456 Park Avenue, Mumbai",
      platform: "Mobile App",
      orderTime: "11:15 AM",
      items: [
        { name: "Insulin Pen", quantity: 1, price: 1200 }
      ],
      total: 1200,
      status: 'confirmed',
      paymentMethod: "Card",
      deliveryType: 'pickup'
    }
  ]);

  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'dispatched': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'Website': return <Globe className="h-4 w-4" />;
      case 'Mobile App': return <Phone className="h-4 w-4" />;
      default: return <Store className="h-4 w-4" />;
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    toast({
      title: "Status updated",
      description: `Order ${orderId} status updated to ${newStatus}`,
    });
  };

  const ordersByStatus = {
    pending: onlineOrders.filter(order => order.status === 'pending'),
    confirmed: onlineOrders.filter(order => order.status === 'confirmed'),
    preparing: onlineOrders.filter(order => order.status === 'preparing'),
    ready: onlineOrders.filter(order => order.status === 'ready'),
    dispatched: onlineOrders.filter(order => order.status === 'dispatched')
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
          <Globe className="h-5 w-5 mb-1" />
          <span className="text-sm">Online Orders</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Online Orders Management
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-yellow-600">{ordersByStatus.pending.length}</h3>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-blue-600">{ordersByStatus.confirmed.length}</h3>
                <p className="text-sm text-gray-500">Confirmed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-orange-600">{ordersByStatus.preparing.length}</h3>
                <p className="text-sm text-gray-500">Preparing</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-green-600">{ordersByStatus.ready.length}</h3>
                <p className="text-sm text-gray-500">Ready</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-purple-600">{ordersByStatus.dispatched.length}</h3>
                <p className="text-sm text-gray-500">Dispatched</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="pending">Pending ({ordersByStatus.pending.length})</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmed ({ordersByStatus.confirmed.length})</TabsTrigger>
            <TabsTrigger value="preparing">Preparing ({ordersByStatus.preparing.length})</TabsTrigger>
            <TabsTrigger value="ready">Ready ({ordersByStatus.ready.length})</TabsTrigger>
            <TabsTrigger value="dispatched">Dispatched ({ordersByStatus.dispatched.length})</TabsTrigger>
          </TabsList>

          {Object.entries(ordersByStatus).map(([status, orders]) => (
            <TabsContent key={status} value={status} className="space-y-4">
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {getPlatformIcon(order.platform)}
                            <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                          <Badge variant="outline">
                            {order.deliveryType === 'delivery' ? <Truck className="h-3 w-3 mr-1" /> : <Package className="h-3 w-3 mr-1" />}
                            {order.deliveryType}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          {order.orderTime}
                        </div>
                      </div>
                      <CardDescription>
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {order.customerName} • {order.customerPhone}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {order.customerAddress}
                          </span>
                          <span className="flex items-center gap-1">
                            <CreditCard className="h-3 w-3" />
                            {order.paymentMethod}
                          </span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">Items:</h4>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{item.name} x {item.quantity}</span>
                                <span>₹{item.price * item.quantity}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between font-medium mt-2 pt-2 border-t">
                            <span>Total:</span>
                            <span>₹{order.total}</span>
                          </div>
                        </div>
                        <div className="ml-6 flex flex-col gap-2">
                          {order.status === 'pending' && (
                            <Button size="sm" onClick={() => updateOrderStatus(order.id, 'confirmed')}>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Confirm
                            </Button>
                          )}
                          {order.status === 'confirmed' && (
                            <Button size="sm" onClick={() => updateOrderStatus(order.id, 'preparing')}>
                              <Package className="h-3 w-3 mr-1" />
                              Start Preparing
                            </Button>
                          )}
                          {order.status === 'preparing' && (
                            <Button size="sm" onClick={() => updateOrderStatus(order.id, 'ready')}>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Mark Ready
                            </Button>
                          )}
                          {order.status === 'ready' && order.deliveryType === 'delivery' && (
                            <Button size="sm" onClick={() => updateOrderStatus(order.id, 'dispatched')}>
                              <Truck className="h-3 w-3 mr-1" />
                              Dispatch
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {orders.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No {status} orders at the moment
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnlineOrdersDialog;
