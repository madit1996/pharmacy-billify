import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Save, X, Trash2 } from "lucide-react";

interface Address {
  id: number;
  type: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  gstin: string;
  isDefault: boolean;
}

interface AddressFormProps {
  address: Address;
  isEditing: boolean;
  onSave: (address: Address) => void;
  onCancel: () => void;
  onDelete: (id: number) => void;
  onEdit: () => void;
}

export const AddressForm = ({ 
  address, 
  isEditing, 
  onSave, 
  onCancel, 
  onDelete, 
  onEdit 
}: AddressFormProps) => {
  const [formData, setFormData] = useState(address);

  const handleSave = () => {
    if (!formData.address1.trim() || !formData.city.trim()) {
      return;
    }
    onSave(formData);
  };

  const handleChange = (field: keyof Address, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isEditing) {
    return (
      <Card className="border-2 border-blue-300 bg-blue-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-lg">Edit Address</h4>
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
              <Label>Address Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Work">Work</SelectItem>
                  <SelectItem value="Office">Office</SelectItem>
                  <SelectItem value="Billing">Billing</SelectItem>
                  <SelectItem value="Shipping">Shipping</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address1">Address Line 1 *</Label>
              <Input
                id="address1"
                value={formData.address1}
                onChange={(e) => handleChange('address1', e.target.value)}
                className="border-red-200 focus:border-red-400"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address2">Address Line 2</Label>
              <Input
                id="address2"
                value={formData.address2}
                onChange={(e) => handleChange('address2', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                className="border-red-200 focus:border-red-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => handleChange('state', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                value={formData.pincode}
                onChange={(e) => handleChange('pincode', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gstin">GSTIN</Label>
              <Input
                id="gstin"
                value={formData.gstin}
                onChange={(e) => handleChange('gstin', e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) => handleChange('isDefault', checked)}
              />
              <Label htmlFor="isDefault">Set as Default Address</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 ${address.isDefault ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-lg">{address.type} Address</h4>
            {address.isDefault && (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Default</Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDelete(address.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Address</Label>
            <p className="font-semibold">{address.address1 || 'Not provided'}</p>
            {address.address2 && <p className="text-sm text-muted-foreground">{address.address2}</p>}
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">City</Label>
            <p className="font-semibold">{address.city || 'Not provided'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">State & Pincode</Label>
            <p className="font-semibold">{address.state || 'N/A'} - {address.pincode || 'N/A'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Contact</Label>
            <p className="font-semibold">{address.phone || address.email || 'Not provided'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};