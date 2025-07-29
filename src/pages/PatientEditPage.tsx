import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ArrowLeft, 
  CalendarIcon, 
  User, 
  MapPin, 
  Phone, 
  CreditCard, 
  Shield, 
  Users, 
  FileText,
  ChevronDown,
  ChevronUp,
  Upload,
  Download,
  Plus,
  Trash2,
  Lock,
  CheckCircle,
  DollarSign
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";

const PatientEditPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("billing");

  // Sample patient data
  const patientData = {
    id: patientId || "PAT-17",
    code: "PAT-17",
    firstName: "Aditya",
    middleName: "Kumar",
    lastName: "Mahajan",
    alternateName: "Adi",
    dateOfBirth: new Date("1996-01-01"),
    age: 29,
    gender: "Male",
    bloodGroup: "O+",
    maritalStatus: "Single",
    nationality: "Indian",
    religion: "Hindu",
    motherTongue: "Punjabi",
    education: "Graduate",
    occupation: "Software Engineer",
    registrationDate: new Date("2025-07-17"),
    source: "Walk-in",
    status: "Active",
    isInactive: false,
    // Contact details
    mobile1: "+91-7889846115",
    otpVerified: true,
    mobile2: "",
    phone1: "",
    phone2: "",
    allowSMS: true,
    email: "aditya.mahajan@example.com",
    alternateEmail: "",
    website: "",
    allowEmail: true,
    // Address
    addressType: "Common",
    address1: "H.No S8/835 Prabha Niwas, Lane No 5 East",
    address2: "Opposite shri Thakur Dwar mandir, Patel Nagar",
    city: "Pathankot",
    state: "Punjab",
    country: "India",
    pincode: "145001",
    printAddress: true,
    // ABHA
    abhaStatus: "Verified",
    abhaNumber: "91-5551-6260-4451",
    abhaAddress: "madit1996@sbx",
    abhaGender: "Male",
    abhaPincode: "145001",
    abhaFullAddress: "H,No S8/835 Prabha Niwas, Lane No 5 East, Opposite shri Thakur Dwar mandir, Patel Nagar, Pathankot, Pathankot, Pathankot, Punjab",
    // Identification
    aadhaar: "1234-5678-9012",
    pan: "ABCDE1234F",
    passport: "",
    drivingLicense: "",
    voterID: ""
  };

  const handleSave = () => {
    toast({
      title: "Patient Updated",
      description: "Patient information has been successfully updated.",
    });
    navigate("/patients");
  };

  const downloadAbhaCard = () => {
    toast({
      title: "ABHA Card Downloaded",
      description: "ABHA card has been downloaded successfully.",
    });
  };

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-6 w-full">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate("/patients")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Patient Details</h1>
            <p className="text-muted-foreground">Edit patient information for {patientData.firstName} {patientData.lastName}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 w-full max-w-full">
        {/* ABHA Details Section - Always Visible at Top */}
        <Card className="mb-6 border-2 border-green-200 bg-green-50/30">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Shield className="h-6 w-6 text-green-600" />
                ABHA Details
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {patientData.abhaStatus}
                </Badge>
                <Lock className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={downloadAbhaCard}>
                <Download className="h-4 w-4 mr-2" />
                Download ABHA Card
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <img 
                  src="https://placehold.co/100x100/E0E0E0/000000?text=Patient" 
                  alt="Patient"
                  className="w-24 h-24 rounded-lg border-2 border-gray-200"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">ABHA Number</Label>
                  <p className="font-semibold">{patientData.abhaNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">ABHA Address</Label>
                  <p className="font-semibold">{patientData.abhaAddress}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Gender</Label>
                  <p className="font-semibold">{patientData.abhaGender}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Pincode</Label>
                  <p className="font-semibold">{patientData.abhaPincode}</p>
                </div>
                <div className="col-span-2 md:col-span-4">
                  <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                  <p className="text-sm">{patientData.abhaFullAddress}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Patient Information - Always Visible */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="h-6 w-6" />
              Basic Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Patient Code</Label>
                <Input id="code" value={patientData.code} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
                <Input id="firstName" defaultValue={patientData.firstName} className="border-red-200 focus:border-red-400" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input id="middleName" defaultValue={patientData.middleName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
                <Input id="lastName" defaultValue={patientData.lastName} className="border-red-200 focus:border-red-400" />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth <span className="text-red-500">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left border-red-200 focus:border-red-400">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(patientData.dateOfBirth, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={patientData.dateOfBirth} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Gender <span className="text-red-500">*</span></Label>
                <Select defaultValue={patientData.gender}>
                  <SelectTrigger className="border-red-200 focus:border-red-400">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Blood Group</Label>
                <Select defaultValue={patientData.bloodGroup}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile1">Mobile Number <span className="text-red-500">*</span></Label>
                <div className="flex gap-2">
                  <Input id="mobile1" defaultValue={patientData.mobile1} className="border-red-200 focus:border-red-400" />
                  {patientData.otpVerified && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 whitespace-nowrap">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input id="email" type="email" defaultValue={patientData.email} className="border-red-200 focus:border-red-400" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address1">Address <span className="text-red-500">*</span></Label>
                <Input id="address1" defaultValue={patientData.address1} className="border-red-200 focus:border-red-400" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                <Input id="city" defaultValue={patientData.city} className="border-red-200 focus:border-red-400" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode <span className="text-red-500">*</span></Label>
                <Input id="pincode" defaultValue={patientData.pincode} className="border-red-200 focus:border-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* HMIS Details - Always Visible */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-6 w-6" />
              HMIS Details (Hospital Information)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation</Label>
                <Input id="occupation" defaultValue={patientData.occupation} />
              </div>
              <div className="space-y-2">
                <Label>Marital Status</Label>
                <Select defaultValue={patientData.maritalStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Divorced">Divorced</SelectItem>
                    <SelectItem value="Widowed">Widowed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input id="nationality" defaultValue={patientData.nationality} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="religion">Religion</Label>
                <Input id="religion" defaultValue={patientData.religion} />
              </div>
              <div className="space-y-2">
                <Label>Registration Source</Label>
                <Select defaultValue={patientData.source}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Walk-in">Walk-in</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Patient Status</Label>
                <Select defaultValue={patientData.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Deceased">Deceased</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Registration Date</Label>
                <Input value={format(patientData.registrationDate, "PPP")} readOnly className="bg-muted" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Details - Tabbed Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Additional Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                <TabsTrigger value="billing" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Billing
                </TabsTrigger>
                <TabsTrigger value="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Additional Address
                </TabsTrigger>
                <TabsTrigger value="insurance" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Insurance
                </TabsTrigger>
                <TabsTrigger value="emergency" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Emergency Contacts
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documents
                </TabsTrigger>
                <TabsTrigger value="other" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Other
                </TabsTrigger>
              </TabsList>

              {/* Billing Tab */}
              <TabsContent value="billing" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Income Group</Label>
                    <Select defaultValue="Middle">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Middle">Middle</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Mode Preference</Label>
                    <Select defaultValue="Cash">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Card">Card</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="Insurance">Insurance</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="creditLimit">Credit Limit</Label>
                    <Input id="creditLimit" defaultValue="50000" type="number" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="outstandingBalance">Outstanding Balance</Label>
                    <Input id="outstandingBalance" value="₹ 1,500.00" readOnly className="bg-muted" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="allowCreditSale" />
                    <Label htmlFor="allowCreditSale">Allow Credit Sale</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="isExempted" />
                    <Label htmlFor="isExempted">Is Exempted</Label>
                  </div>
                </div>
              </TabsContent>

              {/* Additional Address Tab */}
              <TabsContent value="address" className="mt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Additional Addresses</h3>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Address
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Address Type</Label>
                      <Select defaultValue="Work">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Work">Work</SelectItem>
                          <SelectItem value="Temporary">Temporary</SelectItem>
                          <SelectItem value="Permanent">Permanent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address2Line1">Address Line 1</Label>
                      <Input id="address2Line1" placeholder="Enter address" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address2Line2">Address Line 2</Label>
                      <Input id="address2Line2" placeholder="Enter address" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address2City">City</Label>
                      <Input id="address2City" placeholder="Enter city" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address2State">State</Label>
                      <Input id="address2State" placeholder="Enter state" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address2Pincode">Pincode</Label>
                      <Input id="address2Pincode" placeholder="Enter pincode" />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Insurance Tab */}
              <TabsContent value="insurance" className="mt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Insurance Policies</h3>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Insurance
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="insuranceCompany">Insurance Company <span className="text-red-500">*</span></Label>
                      <Input id="insuranceCompany" defaultValue="Star Health Insurance" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="policyNumber">Policy Number <span className="text-red-500">*</span></Label>
                      <Input id="policyNumber" defaultValue="POL123456789" />
                    </div>
                    <div className="space-y-2">
                      <Label>Insurance Type <span className="text-red-500">*</span></Label>
                      <Select defaultValue="Private">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Private">Private</SelectItem>
                          <SelectItem value="Government">Government Scheme</SelectItem>
                          <SelectItem value="Corporate">Corporate</SelectItem>
                          <SelectItem value="TPA">TPA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="policyHolder">Policy Holder Name</Label>
                      <Input id="policyHolder" defaultValue="Aditya Mahajan" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="coverageAmount">Coverage Amount</Label>
                      <Input id="coverageAmount" defaultValue="₹ 5,00,000" />
                    </div>
                    <div className="space-y-2">
                      <Label>Claim Status</Label>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="preAuthRequired" />
                      <Label htmlFor="preAuthRequired">Pre-authorization Required</Label>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Emergency Contacts Tab */}
              <TabsContent value="emergency" className="mt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Emergency Contacts</h3>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Contact
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyName">Contact Name</Label>
                      <Input id="emergencyName" defaultValue="Sunita Devi" />
                    </div>
                    <div className="space-y-2">
                      <Label>Relationship</Label>
                      <Select defaultValue="Mother">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mother">Mother</SelectItem>
                          <SelectItem value="Father">Father</SelectItem>
                          <SelectItem value="Spouse">Spouse</SelectItem>
                          <SelectItem value="Sibling">Sibling</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyPhone">Contact Number</Label>
                      <Input id="emergencyPhone" defaultValue="+91-9876543211" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyAddress">Address</Label>
                      <Textarea id="emergencyAddress" placeholder="Emergency contact address" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyNotes">Notes</Label>
                      <Textarea id="emergencyNotes" placeholder="Special instructions (e.g., Call only after 6 PM)" />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Identification Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="aadhaar">Aadhaar Number</Label>
                      <Input id="aadhaar" defaultValue={patientData.aadhaar} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pan">PAN Card Number</Label>
                      <Input id="pan" defaultValue={patientData.pan} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passport">Passport Number</Label>
                      <Input id="passport" defaultValue={patientData.passport} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="drivingLicense">Driving License Number</Label>
                      <Input id="drivingLicense" defaultValue={patientData.drivingLicense} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="voterID">Voter ID</Label>
                      <Input id="voterID" defaultValue={patientData.voterID} />
                    </div>
                    <div className="space-y-2">
                      <Label>Document Upload</Label>
                      <Button variant="outline" className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Documents
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Other Tab */}
              <TabsContent value="other" className="mt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Other Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="education">Education Level</Label>
                      <Input id="education" defaultValue={patientData.education} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="motherTongue">Mother Tongue</Label>
                      <Input id="motherTongue" defaultValue={patientData.motherTongue} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="remarks">Remarks/Notes</Label>
                      <Textarea id="remarks" placeholder="General notes about the patient" rows={4} />
                    </div>
                    <div className="space-y-2">
                      <Label>Attachments</Label>
                      <Button variant="outline" className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Files
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={() => navigate("/patients")}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientEditPage;
