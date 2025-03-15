
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface BillSummaryProps {
  subtotal: number;
  platformFee: number;
  total: number;
  onPrintBill: () => void;
}

const BillSummary = ({ subtotal, platformFee, total, onPrintBill }: BillSummaryProps) => {
  return (
    <div>
      <h3 className="font-medium text-base mb-3">Summary</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">$ {subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Service fee</span>
          <span className="font-medium">$ {platformFee.toFixed(2)}</span>
        </div>
        
        <Separator />
        
        <div className="flex justify-between text-base font-medium">
          <span>Total</span>
          <span>$ {total.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-4">
        <Button 
          className="w-full h-10 text-base bg-blue-600 hover:bg-blue-700"
          onClick={onPrintBill}
        >
          <Printer className="mr-2 h-4 w-4" />
          Generate Bill
        </Button>
      </div>
    </div>
  );
};

export default BillSummary;
