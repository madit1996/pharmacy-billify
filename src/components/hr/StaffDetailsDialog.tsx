
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Calendar, Users } from "lucide-react";

interface Staff {
  id: string;
  staffId: string;
  name: string;
  department: string;
  designation: string;
  phone: string;
  email: string;
  joinDate: string;
  status: "Active" | "Inactive" | "On Leave";
  certifications: string[];
  experience: string;
  salary: string;
  address: string;
  emergencyContact: string;
}

interface StaffDetailsDialogProps {
  staff: Staff;
  onClose: () => void;
}

const StaffDetailsDialog = ({ staff, onClose }: StaffDetailsDialogProps) => {
  const getStatusBadge = (status: Staff["status"]) => {
    const statusConfig = {
      "Active": "bg-green-100 text-green-800",
      "Inactive": "bg-red-100 text-red-800",
      "On Leave": "bg-yellow-100 text-yellow-800"
    };

    return (
      <Badge className={statusConfig[status]}>
        {status}
      </Badge>
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl">{staff.name}</DialogTitle>
              <p className="text-gray-600">{staff.designation} - {staff.department}</p>
            </div>
            {getStatusBadge(staff.status)}
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="font-medium text-gray-600">Staff ID</p>
                  <p>{staff.staffId}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Experience</p>
                  <p>{staff.experience}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Salary</p>
                  <p>{staff.salary}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-600">Join Date</p>
                  <p>{staff.joinDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{staff.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>{staff.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{staff.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span>Emergency: {staff.emergencyContact}</span>
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {staff.certifications.map((cert, index) => (
                  <Badge key={index} variant="outline">
                    {cert}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            Edit Staff
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StaffDetailsDialog;
