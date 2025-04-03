
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface BillSummaryProps {
  subtotal: number;
  platformFee: number;
  total: number;
  onPrintBill: () => void;
}

const BillSummary = ({
  subtotal,
  platformFee,
  total,
  onPrintBill,
}: BillSummaryProps) => {
  return (
    <div>
      <h3 className="font-medium text-lg mb-3 text-gray-800">Summary</h3>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Platform fee</span>
          <span className="font-medium">${platformFee.toFixed(2)}</span>
        </div>
        
        <Separator className="my-2" />
        
        <div className="flex justify-between text-base font-bold">
          <span>Total</span>
          <span className="text-purple-600">${total.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="mt-4">
        <Button 
          className="w-full h-12 text-base font-medium bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg"
          onClick={onPrintBill}
        >
          <Printer className="mr-2 h-5 w-5" />
          Complete & Print Bill
        </Button>
      </div>
    </div>
  );
};

export default BillSummary;
