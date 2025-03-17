
import { useState } from "react";
import { Package, CreditCard, Landmark, ShoppingCart, Tag, Printer } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

type PaymentMethod = "card" | "bank" | "scheme" | "orderList" | "vouchers" | "reprint";

type CardFormValues = {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
};

type BankFormValues = {
  accountNumber: string;
  bankName: string;
  ifscCode: string;
};

type SchemeFormValues = {
  schemeName: string;
  discountPercentage: string;
};

const PaymentOptions = () => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const { toast } = useToast();

  const cardForm = useForm<CardFormValues>({
    defaultValues: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: ""
    }
  });

  const bankForm = useForm<BankFormValues>({
    defaultValues: {
      accountNumber: "",
      bankName: "",
      ifscCode: ""
    }
  });

  const schemeForm = useForm<SchemeFormValues>({
    defaultValues: {
      schemeName: "",
      discountPercentage: "0"
    }
  });

  const handleCardSubmit = (data: CardFormValues) => {
    toast({
      title: "Card Payment Processed",
      description: `Payment processed for card ending in ${data.cardNumber.slice(-4)}`,
    });
    setSelectedPayment(null);
  };

  const handleBankSubmit = (data: BankFormValues) => {
    toast({
      title: "Bank Transfer Initiated",
      description: `Bank transfer to account ${data.accountNumber.slice(-4)} initiated`,
    });
    setSelectedPayment(null);
  };

  const handleSchemeSubmit = (data: SchemeFormValues) => {
    toast({
      title: "Scheme Applied",
      description: `${data.schemeName} scheme with ${data.discountPercentage}% discount applied`,
    });
    setSelectedPayment(null);
  };

  const handleOrderList = () => {
    toast({
      title: "Order List",
      description: "Order list functionality coming soon",
    });
    setSelectedPayment(null);
  };

  const handleVouchers = () => {
    toast({
      title: "Vouchers",
      description: "Voucher functionality coming soon",
    });
    setSelectedPayment(null);
  };

  const handleReprint = () => {
    toast({
      title: "Re-Print Requested",
      description: "Last bill sent to printer",
    });
    setSelectedPayment(null);
  };

  const paymentOptions = [
    { icon: Package, label: "Order List", method: "orderList" as PaymentMethod },
    { icon: Tag, label: "Scheme", method: "scheme" as PaymentMethod },
    { icon: ShoppingCart, label: "Vouchers", method: "vouchers" as PaymentMethod },
    { icon: CreditCard, label: "Card", method: "card" as PaymentMethod },
    { icon: Landmark, label: "Bank", method: "bank" as PaymentMethod },
    { icon: Printer, label: "Re-Print", method: "reprint" as PaymentMethod }
  ];

  return (
    <div className="border-t">
      <div className="p-3 bg-gray-50">
        <div className="text-xs text-right text-orange-600 font-medium">
          Executive Credit Limit: Rs 0.00
        </div>
      </div>
      
      <div className="grid grid-cols-6 divide-x">
        {paymentOptions.map((option, index) => (
          <button
            key={index}
            className="flex flex-col items-center justify-center py-3 hover:bg-gray-50 transition-colors"
            onClick={() => setSelectedPayment(option.method)}
          >
            <option.icon className="h-5 w-5 text-gray-600 mb-1" />
            <span className="text-xs">{option.label}</span>
          </button>
        ))}
      </div>

      {/* Card Payment Dialog */}
      <Dialog open={selectedPayment === "card"} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Card Payment</DialogTitle>
          </DialogHeader>
          <Form {...cardForm}>
            <form onSubmit={cardForm.handleSubmit(handleCardSubmit)} className="space-y-4">
              <FormField
                control={cardForm.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input placeholder="1234 5678 9012 3456" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={cardForm.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input placeholder="MM/YY" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={cardForm.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input placeholder="123" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={cardForm.control}
                name="cardholderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cardholder Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setSelectedPayment(null)}>
                  Cancel
                </Button>
                <Button type="submit">Process Payment</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Bank Transfer Dialog */}
      <Dialog open={selectedPayment === "bank"} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Bank Transfer</DialogTitle>
          </DialogHeader>
          <Form {...bankForm}>
            <form onSubmit={bankForm.handleSubmit(handleBankSubmit)} className="space-y-4">
              <FormField
                control={bankForm.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Account Number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={bankForm.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Bank Name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={bankForm.control}
                name="ifscCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IFSC Code</FormLabel>
                    <FormControl>
                      <Input placeholder="IFSC Code" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setSelectedPayment(null)}>
                  Cancel
                </Button>
                <Button type="submit">Process Transfer</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Scheme Dialog */}
      <Dialog open={selectedPayment === "scheme"} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Apply Scheme</DialogTitle>
          </DialogHeader>
          <Form {...schemeForm}>
            <form onSubmit={schemeForm.handleSubmit(handleSchemeSubmit)} className="space-y-4">
              <FormField
                control={schemeForm.control}
                name="schemeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scheme Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter scheme name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={schemeForm.control}
                name="discountPercentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Percentage</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter discount %" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setSelectedPayment(null)}>
                  Cancel
                </Button>
                <Button type="submit">Apply Scheme</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentOptions;
