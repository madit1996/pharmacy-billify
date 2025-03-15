
import { Edit2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LabBillItem } from "@/types/lab-types";

interface BillItemProps {
  item: LabBillItem;
  updateItemQuantity: (id: string, change: number) => void;
  removeItem: (id: string) => void;
}

const BillItem = ({ item, updateItemQuantity, removeItem }: BillItemProps) => {
  return (
    <div className="relative">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900 text-sm">{item.testName}</h4>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => removeItem(item.id)}
              className="h-6 w-6 p-0"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-1 line-clamp-1">
            {item.category === 'pathology' ? 'Pathology' : 'Radiology'}
          </p>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <span className="text-sm font-medium text-green-600">$ {item.price.toFixed(2)}</span>
            </div>
            
            <div className="flex items-center border rounded-md">
              <Button 
                variant="ghost" 
                size="sm"
                className="px-1 h-6"
                onClick={() => updateItemQuantity(item.id, -1)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              
              <span className="w-6 text-center text-xs">{item.quantity}</span>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="px-1 h-6"
                onClick={() => updateItemQuantity(item.id, 1)}
              >
                <Plus className="h-3 w-3 text-blue-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillItem;
