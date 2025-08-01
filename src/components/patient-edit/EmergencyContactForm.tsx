import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, X, Trash2 } from "lucide-react";

interface EmergencyContact {
  id: number;
  name: string;
  relationship: string;
  phone: string;
  address: string;
  notes: string;
  isPrimary: boolean;
}

interface EmergencyContactFormProps {
  contact: EmergencyContact;
  isEditing: boolean;
  onSave: (contact: EmergencyContact) => void;
  onCancel: () => void;
  onDelete: (id: number) => void;
  onEdit: () => void;
}

export const EmergencyContactForm = ({ 
  contact, 
  isEditing, 
  onSave, 
  onCancel, 
  onDelete, 
  onEdit 
}: EmergencyContactFormProps) => {
  const [formData, setFormData] = useState(contact);

  const handleSave = () => {
    if (!formData.name.trim() || !formData.phone.trim()) {
      return;
    }
    onSave(formData);
  };

  const handleChange = (field: keyof EmergencyContact, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isEditing) {
    return (
      <Card className="border-2 border-orange-300 bg-orange-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-lg">Edit Emergency Contact</h4>
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
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="border-red-200 focus:border-red-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="border-red-200 focus:border-red-400"
              />
            </div>
            <div className="space-y-2">
              <Label>Relationship</Label>
              <Select value={formData.relationship} onValueChange={(value) => handleChange('relationship', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Father">Father</SelectItem>
                  <SelectItem value="Mother">Mother</SelectItem>
                  <SelectItem value="Spouse">Spouse</SelectItem>
                  <SelectItem value="Sibling">Sibling</SelectItem>
                  <SelectItem value="Child">Child</SelectItem>
                  <SelectItem value="Friend">Friend</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPrimary"
                checked={formData.isPrimary}
                onCheckedChange={(checked) => handleChange('isPrimary', checked)}
              />
              <Label htmlFor="isPrimary">Set as Primary Contact</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 ${contact.isPrimary ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-lg">{contact.name || 'New Contact'}</h4>
            {contact.isPrimary && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Primary</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDelete(contact.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
            <p className="font-semibold">{contact.phone || 'Not provided'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Relationship</Label>
            <p className="font-semibold">{contact.relationship || 'Not specified'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Address</Label>
            <p className="font-semibold">{contact.address || 'Not provided'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Notes</Label>
            <p className="font-semibold">{contact.notes || 'None'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};