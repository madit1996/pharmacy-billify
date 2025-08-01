import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save, X, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface InsurancePolicy {
  id: number;
  company: string;
  policyNumber: string;
  type: string;
  policyHolder: string;
  coverageAmount: number;
  status: string;
  expiryDate: Date;
  preAuthRequired: boolean;
  isPrimary: boolean;
}

interface InsurancePolicyFormProps {
  policy: InsurancePolicy;
  isEditing: boolean;
  onSave: (policy: InsurancePolicy) => void;
  onCancel: () => void;
  onDelete: (id: number) => void;
  onEdit: () => void;
}

export const InsurancePolicyForm = ({ 
  policy, 
  isEditing, 
  onSave, 
  onCancel, 
  onDelete, 
  onEdit 
}: InsurancePolicyFormProps) => {
  const [formData, setFormData] = useState(policy);

  const handleSave = () => {
    if (!formData.company.trim() || !formData.policyNumber.trim()) {
      return;
    }
    onSave(formData);
  };

  const handleChange = (field: keyof InsurancePolicy, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isEditing) {
    return (
      <Card className="border-2 border-blue-300 bg-blue-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-lg">Edit Insurance Policy</h4>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={onCancel}>
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Insurance Company *</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                className="border-red-200 focus:border-red-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="policyNumber">Policy Number *</Label>
              <Input
                id="policyNumber"
                value={formData.policyNumber}
                onChange={(e) => handleChange('policyNumber', e.target.value)}
                className="border-red-200 focus:border-red-400"
              />
            </div>
            <div className="space-y-2">
              <Label>Policy Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Private">Private</SelectItem>
                  <SelectItem value="Corporate">Corporate</SelectItem>
                  <SelectItem value="Government">Government</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="policyHolder">Policy Holder Name</Label>
              <Input
                id="policyHolder"
                value={formData.policyHolder}
                onChange={(e) => handleChange('policyHolder', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverageAmount">Coverage Amount (₹)</Label>
              <Input
                id="coverageAmount"
                type="number"
                value={formData.coverageAmount}
                onChange={(e) => handleChange('coverageAmount', parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Expiry Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expiryDate ? format(formData.expiryDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.expiryDate}
                    onSelect={(date) => date && handleChange('expiryDate', date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="preAuthRequired"
                  checked={formData.preAuthRequired}
                  onCheckedChange={(checked) => handleChange('preAuthRequired', checked)}
                />
                <Label htmlFor="preAuthRequired">Pre-Authorization Required</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPrimary"
                  checked={formData.isPrimary}
                  onCheckedChange={(checked) => handleChange('isPrimary', checked)}
                />
                <Label htmlFor="isPrimary">Set as Primary Policy</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 ${policy.isPrimary ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-lg">{policy.company || 'New Policy'}</h4>
            {policy.isPrimary && (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Primary</Badge>
            )}
            <Badge className={policy.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {policy.status}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDelete(policy.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Policy Number</Label>
            <p className="font-semibold">{policy.policyNumber || 'Not provided'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Type</Label>
            <p className="font-semibold">{policy.type}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Coverage</Label>
            <p className="font-semibold">₹{policy.coverageAmount.toLocaleString()}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Expiry Date</Label>
            <p className="font-semibold">{policy.expiryDate ? format(policy.expiryDate, "MMM dd, yyyy") : 'Not set'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Policy Holder</Label>
            <p className="font-semibold">{policy.policyHolder || 'Not specified'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Pre-Auth Required</Label>
            <p className="font-semibold">{policy.preAuthRequired ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};