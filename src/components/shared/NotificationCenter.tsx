import { useState } from "react";
import { Bell, Check, X, TestTube, Pill, Camera, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { OrderNotification } from "@/types/order-types";
import { format } from "date-fns";

// Mock notifications
const mockNotifications: OrderNotification[] = [
  {
    id: "NOT001",
    orderId: "ORD001",
    recipientDepartment: "Lab",
    message: "New lab test order from Dr. Kartik for Priya Jain",
    type: "new-order",
    read: false,
    createdAt: new Date("2025-07-25T17:20:00")
  },
  {
    id: "NOT002",
    orderId: "PRX001",
    recipientDepartment: "Pharmacy",
    message: "New prescription order from Dr. Kartik for Priya Jain",
    type: "new-order",
    read: false,
    createdAt: new Date("2025-07-25T17:15:00")
  },
  {
    id: "NOT003",
    orderId: "ORD003",
    recipientDepartment: "Radiology",
    message: "Chest X-Ray order completed for Priya Jain",
    type: "completion",
    read: true,
    createdAt: new Date("2025-07-24T16:30:00")
  }
];

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new-order':
        return <TestTube className="h-4 w-4 text-blue-600" />;
      case 'status-update':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'completion':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'cancellation':
        return <X className="h-4 w-4 text-red-600" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case 'Lab':
        return <TestTube className="h-3 w-3" />;
      case 'Pharmacy':
        return <Pill className="h-3 w-3" />;
      case 'Radiology':
        return <Camera className="h-3 w-3" />;
      case 'Vaccination Center':
        return <Shield className="h-3 w-3" />;
      default:
        return <Bell className="h-3 w-3" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No notifications
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b last:border-b-0 hover:bg-muted/30 cursor-pointer ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex items-center gap-1">
                              {getDepartmentIcon(notification.recipientDepartment)}
                              <span className="text-xs font-medium text-muted-foreground">
                                {notification.recipientDepartment}
                              </span>
                            </div>
                            {!notification.read && (
                              <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-foreground mb-1">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              Order #{notification.orderId}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {format(notification.createdAt, "MMM d, HH:mm")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;