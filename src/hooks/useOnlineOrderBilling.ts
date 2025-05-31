
import { useState } from "react";
import { BillItem, CustomerDetails } from "@/pages/PharmacyPage";
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

export const useOnlineOrderBilling = () => {
  const { toast } = useToast();

  const convertOrderToBillItems = (order: OnlineOrder): BillItem[] => {
    return order.items.map((item, index) => ({
      id: `${order.id}-${index}`,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: "/placeholder.svg", // Default image
      dosage: "As prescribed",
      discount: 0
    }));
  };

  const convertOrderToCustomer = (order: OnlineOrder): CustomerDetails => {
    return {
      id: order.id,
      name: order.customerName,
      mobile: order.customerPhone,
      address: order.customerAddress
    };
  };

  const processOnlineOrderBilling = (
    order: OnlineOrder,
    setBillItems: (items: BillItem[]) => void,
    setSelectedCustomer: (customer: CustomerDetails) => void,
    setActiveTab: (tab: 'analytics' | 'billing') => void
  ) => {
    // Convert order to bill items
    const billItems = convertOrderToBillItems(order);
    const customer = convertOrderToCustomer(order);

    // Pre-fill billing data
    setBillItems(billItems);
    setSelectedCustomer(customer);
    
    // Switch to billing tab
    setActiveTab('billing');

    toast({
      title: "Order loaded for billing",
      description: `Order ${order.id} has been pre-filled in the billing system`,
    });
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    toast({
      title: "Order status updated",
      description: `Order ${orderId} status updated to ${newStatus}`,
    });
  };

  const dispatchOrder = (orderId: string, trackingNumber?: string) => {
    toast({
      title: "Order dispatched",
      description: trackingNumber 
        ? `Order ${orderId} dispatched with tracking: ${trackingNumber}`
        : `Order ${orderId} has been dispatched`,
    });
  };

  return {
    convertOrderToBillItems,
    convertOrderToCustomer,
    processOnlineOrderBilling,
    updateOrderStatus,
    dispatchOrder
  };
};
