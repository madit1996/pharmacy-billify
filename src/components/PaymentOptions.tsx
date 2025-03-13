
import { Package, CreditCard, Landmark, ShoppingCart, Tag, Printer } from "lucide-react";

const PaymentOptions = () => {
  const paymentOptions = [
    { icon: Package, label: "Order List" },
    { icon: Tag, label: "Scheme" },
    { icon: ShoppingCart, label: "Vouchers" },
    { icon: CreditCard, label: "Card" },
    { icon: Landmark, label: "Bank" },
    { icon: Printer, label: "Re-Print" }
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
          >
            <option.icon className="h-5 w-5 text-gray-600 mb-1" />
            <span className="text-xs">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PaymentOptions;
