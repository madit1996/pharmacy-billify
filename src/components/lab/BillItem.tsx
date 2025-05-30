
import { Minus, Plus, Trash2, UserCircle, FileText, TestTube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LabBillItem, LabTestRepresentative } from "@/types/lab-types";
import { TestTubeIcon } from "./LabIcons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface BillItemProps {
  item: LabBillItem;
  updateItemQuantity: (id: string, change: number) => void;
  removeItem: (id: string) => void;
  onAssign?: (id: string) => void;
  representatives?: LabTestRepresentative[];
  onUpdateStatus?: (id: string, status: string, estimatedTime?: string) => void;
  onUpdateSampleDetails?: (id: string, details: string) => void;
}

const BillItem = ({
  item,
  updateItemQuantity,
  removeItem,
  onAssign,
  representatives,
  onUpdateStatus,
  onUpdateSampleDetails
}: BillItemProps) => {
  const [sampleDetails, setSampleDetails] = useState(item.sampleDetails || "");
  const [showSampleInput, setShowSampleInput] = useState(false);
  
  const handleSaveDetails = () => {
    if (onUpdateSampleDetails) {
      onUpdateSampleDetails(item.id, sampleDetails);
      setShowSampleInput(false);
    }
  };
  
  return (
    <div className="bg-white border border-gray-100 rounded-lg shadow-sm p-4 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-purple-100 rounded-full p-2 mr-3">
            <TestTubeIcon className="h-5 w-5 text-purple-700" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{item.testName}</h4>
            <p className="text-xs text-gray-500 mt-1">{item.category}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {item.representativeId && representatives && (
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              {representatives.find(r => r.id === item.representativeId)?.name || 'Assigned'}
            </Badge>
          )}
          
          {onAssign && !item.representativeId && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs text-purple-600 border-purple-200 hover:bg-purple-50"
              onClick={() => onAssign(item.id)}
            >
              <UserCircle className="h-3 w-3 mr-1" />
              Assign
            </Button>
          )}

          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => removeItem(item.id)}
            className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
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

      {/* Display test status if it's being tracked */}
      {item.status && (
        <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-xs text-gray-500 mr-2">Status:</span>
              <Badge variant={
                item.status === 'pending' ? 'outline' : 
                item.status === 'sampling' ? 'secondary' :
                item.status === 'processing' ? 'default' :
                item.status === 'completed' ? 'outline' : 'destructive'
              } className={
                item.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' : ''
              }>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Badge>
            </div>
            
            <div className="flex gap-2">
              {onUpdateSampleDetails && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-6 text-xs"
                  onClick={() => setShowSampleInput(!showSampleInput)}
                >
                  <TestTube className="h-3 w-3 mr-1" />
                  Sample Info
                </Button>
              )}
            </div>
          </div>
          
          {/* Sample details input */}
          {showSampleInput && (
            <div className="mt-2 space-y-2">
              <Label htmlFor="sample-details" className="text-xs">Sample Details</Label>
              <div className="flex gap-2">
                <Input
                  id="sample-details"
                  value={sampleDetails}
                  onChange={(e) => setSampleDetails(e.target.value)}
                  className="h-7 text-xs"
                  placeholder="e.g., 10ml blood sample, fasting"
                />
                <Button 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={handleSaveDetails}
                >
                  Save
                </Button>
              </div>
            </div>
          )}
          
          <div className="text-xs text-gray-500 mt-2">
            {item.estimatedTime ? `Est. completion: ${item.estimatedTime}` : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default BillItem;
