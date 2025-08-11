export type UserRole = "doctor" | "org_admin";

export type CreditType = "free" | "individual" | "organization";

export interface CreditBalance {
  free: number;
  individual: number;
  organization: number;
}

export interface PricingTier {
  min: number;
  max?: number;
  pricePerCredit: number;
}

export interface CreditUsage {
  id: string;
  date: Date;
  feature: string;
  creditsUsed: number;
  appointmentId?: string;
  source: CreditType;
  doctor: string;
  patientName?: string;
}

export interface CreditTransaction {
  id: string;
  date: Date;
  type: "purchase" | "usage" | "refill";
  credits: number;
  amount?: number;
  source: CreditType;
  status: "completed" | "pending" | "failed";
  invoiceId?: string;
}

export interface Organization {
  id: string;
  name: string;
  doctorCount: number;
  adminId: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  isElitePlan: boolean;
}

export interface PurchaseRequest {
  credits: number;
  type: CreditType;
  couponCode?: string;
}

export interface PricingCalculation {
  credits: number;
  pricePerCredit: number;
  subtotal: number;
  gstAmount: number;
  discount: number;
  total: number;
  savings: number;
}

export interface Coupon {
  code: string;
  type: "flat" | "percentage" | "bonus_credits";
  value: number;
  minPurchase?: number;
  expiryDate?: Date;
  usageLimit?: number;
  usedCount: number;
}

export interface AutoRefillSettings {
  enabled: boolean;
  threshold: number;
  purchaseAmount: number;
  paymentMethodId?: string;
}

export const INDIVIDUAL_PRICING_TIERS: PricingTier[] = [
  { min: 1, max: 1499, pricePerCredit: 15 },
  { min: 1500, max: 3499, pricePerCredit: 13.5 },
  { min: 3500, pricePerCredit: 12 }
];

export const ORG_PRICING = {
  pricePerCredit: 12,
  getMinimumBuyIn: (doctorCount: number) => Math.max(8000, doctorCount * 2500)
};

export const GST_RATE = 0.18; // 18% GST
export const ELITE_FREE_CREDITS_PER_MONTH = 150;