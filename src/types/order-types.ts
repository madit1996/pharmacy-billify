export type OrderType = 'lab-test' | 'radiology-scan' | 'prescription' | 'vaccination';

export type OrderStatus = 'pending' | 'acknowledged' | 'in-progress' | 'completed' | 'cancelled';

export type OrderPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Order {
  id: string;
  type: OrderType;
  patientId: string;
  patientName: string;
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  orderDate: Date;
  status: OrderStatus;
  priority: OrderPriority;
  department: string;
  targetDepartment: string; // where the order should be fulfilled
  description: string;
  notes?: string;
  estimatedCompletionTime?: Date;
  completedAt?: Date;
  assignedTo?: string;
  orderDetails: Record<string, any>; // specific details based on order type
  documentId?: string; // linked document if generated
}

// Specific order detail interfaces
export interface LabTestOrderDetails {
  testNames: string[];
  sampleType: string;
  fasting: boolean;
  specialInstructions?: string;
  homeCollection?: {
    address: string;
    preferredTime: Date;
    contactNumber: string;
  };
}

export interface RadiologyOrderDetails {
  scanType: string;
  bodyPart: string;
  contrast: boolean;
  clinicalHistory: string;
  urgency: 'routine' | 'urgent' | 'stat';
}

export interface PrescriptionOrderDetails {
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity: number;
    instructions?: string;
  }[];
  totalAmount: number;
  paymentStatus?: 'pending' | 'paid';
}

export interface VaccinationOrderDetails {
  vaccineName: string;
  doseNumber?: number;
  scheduledDate: Date;
  location: string;
  notes?: string;
}

export interface OrderNotification {
  id: string;
  orderId: string;
  recipientDepartment: string;
  recipientUserId?: string;
  message: string;
  type: 'new-order' | 'status-update' | 'completion' | 'cancellation';
  read: boolean;
  createdAt: Date;
}

export interface DoctorOrderTracker {
  doctorId: string;
  doctorName: string;
  pendingOrders: Order[];
  inProgressOrders: Order[];
  completedOrders: Order[];
  totalOrdersToday: number;
  completionRate: number; // percentage of completed orders
}