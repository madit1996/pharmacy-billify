
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LabBillItem } from "@/types/lab-types";
import { TestTubeIcon } from "./LabIcons";

interface BillItemProps {
  item: LabBillItem;
  updateItemQuantity: (id: string, change: number) => void;
  removeItem: (id: string) => void;
}

const BillItem = ({ item, updateItemQuantity, removeItem }: BillItemProps) => {
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-purple-100 rounded-full p-2 mr-3">
            <TestTubeIcon className="h-5 w-5 text-purple-700" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{item.name}</h4>
            <p className="text-xs text-gray-500 mt-1">{item.testType}</p>
          </div>
        </div>

        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => removeItem(item.id)}
          className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center rounded-md border border-gray-200 overflow-hidden">
          <Button 
            variant="ghost" 
            size="sm"
            className="px-2 h-7 rounded-none bg-gray-50 hover:bg-gray-100 text-gray-600"
            onClick={() => updateItemQuantity(item.id, -1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
          
          <Button 
            variant="ghost" 
            size="sm"
            className="px-2 h-7 rounded-none bg-gray-50 hover:bg-purple-100 text-purple-600"
            onClick={() => updateItemQuantity(item.id, 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        <span className="text-sm font-medium text-purple-700">
          ${(item.price * item.quantity).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default BillItem;
