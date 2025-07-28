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
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";

const PatientEditPage = () => {
  const navigate = useNavigate();
  const { patientId } = useParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [isGeneralOpen, setIsGeneralOpen] = useState(true);
  const [isIdentificationOpen, setIsIdentificationOpen] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(true);
  const [isAddressOpen, setIsAddressOpen] = useState(true);
  const [isAdditionalAddressOpen, setIsAdditionalAddressOpen] = useState(false);

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

  const CollapsibleSection = ({ title, isOpen, setIsOpen, children }: {
    title: string;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    children: React.ReactNode;
  }) => (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="mb-4">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors">
            <CardTitle className="flex items-center justify-between text-lg">
              {title}
              {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0">
            {children}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-6">
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
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-4xl grid-cols-6">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              General & ID
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact & Address
            </TabsTrigger>
            <TabsTrigger value="abha" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              ABHA Details
            </TabsTrigger>
            <TabsTrigger value="hmis" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              HMIS Details
            </TabsTrigger>
            <TabsTrigger value="insurance" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Insurance
            </TabsTrigger>
            <TabsTrigger value="emergency" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Emergency
            </TabsTrigger>
          </TabsList>

          {/* General & Identification Tab */}
          <TabsContent value="general" className="mt-6">
            <div className="max-w-6xl">
              <CollapsibleSection title="General Details" isOpen={isGeneralOpen} setIsOpen={setIsGeneralOpen}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="code">Code</Label>
                    <Input id="code" value={patientData.code} readOnly className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input id="firstName" defaultValue={patientData.firstName} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input id="middleName" defaultValue={patientData.middleName} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input id="lastName" defaultValue={patientData.lastName} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alternateName">Alternate Name</Label>
                    <Input id="alternateName" defaultValue={patientData.alternateName} />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(patientData.dateOfBirth, "PPP")}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={patientData.dateOfBirth}
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input id="age" value={patientData.age} readOnly className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <Select defaultValue={patientData.gender}>
                      <SelectTrigger>
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
                    <Label htmlFor="motherTongue">Mother Tongue</Label>
                    <Input id="motherTongue" defaultValue={patientData.motherTongue} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="education">Education Level</Label>
                    <Input id="education" defaultValue={patientData.education} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input id="occupation" defaultValue={patientData.occupation} />
                  </div>
                  <div className="space-y-2">
                    <Label>Registration Date</Label>
                    <Input value={format(patientData.registrationDate, "PPP")} readOnly className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Source</Label>
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
                    <Label>Status</Label>
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
                  <div className="flex items-center space-x-2">
                    <Checkbox id="isInactive" defaultChecked={patientData.isInactive} />
                    <Label htmlFor="isInactive">Is Inactive</Label>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Identification Documents" isOpen={isIdentificationOpen} setIsOpen={setIsIdentificationOpen}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </CollapsibleSection>
            </div>
          </TabsContent>

          {/* Contact & Address Tab */}
          <TabsContent value="contact" className="mt-6">
            <div className="max-w-6xl">
              <CollapsibleSection title="Contact Details" isOpen={isContactOpen} setIsOpen={setIsContactOpen}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="mobile1">Mobile No. 1 *</Label>
                    <div className="flex gap-2">
                      <Input id="mobile1" defaultValue={patientData.mobile1} />
                      {patientData.otpVerified && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobile2">Mobile No. 2</Label>
                    <Input id="mobile2" defaultValue={patientData.mobile2} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone1">Phone No. 1</Label>
                    <Input id="phone1" defaultValue={patientData.phone1} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone2">Phone No. 2</Label>
                    <Input id="phone2" defaultValue={patientData.phone2} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="allowSMS" defaultChecked={patientData.allowSMS} />
                    <Label htmlFor="allowSMS">Allow SMS</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" defaultValue={patientData.email} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alternateEmail">Alternate Email</Label>
                    <Input id="alternateEmail" type="email" defaultValue={patientData.alternateEmail} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" defaultValue={patientData.website} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="allowEmail" defaultChecked={patientData.allowEmail} />
                    <Label htmlFor="allowEmail">Allow Email</Label>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Primary Address" isOpen={isAddressOpen} setIsOpen={setIsAddressOpen}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>Address Type</Label>
                    <Select defaultValue={patientData.addressType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Common">Common</SelectItem>
                        <SelectItem value="Home">Home</SelectItem>
                        <SelectItem value="Office">Office</SelectItem>
                        <SelectItem value="Temporary">Temporary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address1">Address Line 1 *</Label>
                    <Input id="address1" defaultValue={patientData.address1} />
                  </div>
                  <div className="space-y-2 md:col-span-3">
                    <Label htmlFor="address2">Address Line 2</Label>
                    <Input id="address2" defaultValue={patientData.address2} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" defaultValue={patientData.city} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input id="state" defaultValue={patientData.state} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input id="country" defaultValue={patientData.country} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input id="pincode" defaultValue={patientData.pincode} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="printAddress" defaultChecked={patientData.printAddress} />
                    <Label htmlFor="printAddress">Print Address</Label>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Additional Addresses" isOpen={isAdditionalAddressOpen} setIsOpen={setIsAdditionalAddressOpen}>
                <div className="text-center py-8">
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Additional Address
                  </Button>
                </div>
              </CollapsibleSection>
            </div>
          </TabsContent>

          {/* ABHA Details Tab */}
          <TabsContent value="abha" className="mt-6">
            <div className="max-w-4xl">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    ABHA Details
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {patientData.abhaStatus}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <div className="flex justify-center">
                        <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                          <User className="h-12 w-12 text-muted-foreground" />
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Photo
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="abhaFirstName">First Name</Label>
                          <Input id="abhaFirstName" defaultValue={patientData.firstName} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="abhaMiddleName">Middle Name</Label>
                          <Input id="abhaMiddleName" defaultValue={patientData.middleName} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="abhaLastName">Last Name</Label>
                          <Input id="abhaLastName" defaultValue={patientData.lastName} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="abhaPhone">Phone</Label>
                          <Input id="abhaPhone" defaultValue={patientData.mobile1} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="abhaNumber">ABHA Number</Label>
                        <Input id="abhaNumber" defaultValue={patientData.abhaNumber} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="abhaAddress">ABHA Address</Label>
                        <Input id="abhaAddress" defaultValue={patientData.abhaAddress} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Gender</Label>
                          <Select defaultValue={patientData.abhaGender}>
                            <SelectTrigger>
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
                          <Label htmlFor="abhaPincode">Pincode</Label>
                          <Input id="abhaPincode" defaultValue={patientData.abhaPincode} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="abhaFullAddress">Address</Label>
                        <Textarea id="abhaFullAddress" defaultValue={patientData.abhaFullAddress} rows={3} />
                      </div>
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        <Download className="h-4 w-4 mr-2" />
                        Download ABHA Card
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* HMIS Details Tab */}
          <TabsContent value="hmis" className="mt-6">
            <div className="max-w-6xl space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>HMIS General & Administrative</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Default Executive</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Executive" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dr-sharma">Dr. Sharma</SelectItem>
                          <SelectItem value="dr-singh">Dr. Singh</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Income Group</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Income Group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="middle">Middle</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Customer Group</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Customer Group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="walk-in">Walk-in</SelectItem>
                          <SelectItem value="referral">Referral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="referredBy">Referred By</Label>
                      <Input id="referredBy" placeholder="Enter referrer name" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="isLodger" />
                      <Label htmlFor="isLodger">Is Lodger</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="isExempted" />
                      <Label htmlFor="isExempted">Is Exempted</Label>
                    </div>
                    <div className="space-y-2 md:col-span-3">
                      <Label htmlFor="hmisRemarks">Remarks/Notes</Label>
                      <Textarea id="hmisRemarks" placeholder="Internal HMIS notes" rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label>Patient Photo</Label>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </Button>
                        <Button variant="outline" size="sm">
                          Take Picture
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Billing & Financial</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Billing Cycle</Label>
                      <Select defaultValue="monthly">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Account Pay</Label>
                      <Select defaultValue="self-pay">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="self-pay">Self-Pay</SelectItem>
                          <SelectItem value="insurance">Insurance</SelectItem>
                          <SelectItem value="corporate">Corporate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Branch</Label>
                      <Select defaultValue="main">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="main">Main Hospital</SelectItem>
                          <SelectItem value="branch1">Branch 1</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="allowCreditSale" />
                      <Label htmlFor="allowCreditSale">Allow Credit Sale</Label>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="creditLimit">Credit Limit</Label>
                      <Input id="creditLimit" placeholder="50000" />
                    </div>
                    <div className="space-y-2">
                      <Label>Outstanding Balance</Label>
                      <Input value="₹ 1,500.00" readOnly className="bg-muted" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Insurance Details Tab */}
          <TabsContent value="insurance" className="mt-6">
            <div className="max-w-6xl">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Insurance Policies
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Policy
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Primary Insurance Policy</h4>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Insurance Company *</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Company" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="star-health">Star Health Insurance</SelectItem>
                              <SelectItem value="hdfc-ergo">HDFC ERGO</SelectItem>
                              <SelectItem value="icici-lombard">ICICI Lombard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="policyNumber">Policy Number *</Label>
                          <Input id="policyNumber" placeholder="POL123456789" />
                        </div>
                        <div className="space-y-2">
                          <Label>Insurance Type *</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="private">Private</SelectItem>
                              <SelectItem value="government">Government Scheme</SelectItem>
                              <SelectItem value="corporate">Corporate</SelectItem>
                              <SelectItem value="tpa">TPA</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="policyHolder">Policy Holder Name *</Label>
                          <Input id="policyHolder" defaultValue={`${patientData.firstName} ${patientData.lastName}`} />
                        </div>
                        <div className="space-y-2">
                          <Label>Relationship *</Label>
                          <Select defaultValue="self">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="self">Self</SelectItem>
                              <SelectItem value="spouse">Spouse</SelectItem>
                              <SelectItem value="child">Child</SelectItem>
                              <SelectItem value="parent">Parent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="coverageAmount">Coverage Amount</Label>
                          <Input id="coverageAmount" placeholder="₹ 5,00,000" />
                        </div>
                        <div className="space-y-2">
                          <Label>Validity Start Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                Select start date
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" className="pointer-events-auto" />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label>Validity End Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                Select end date
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" className="pointer-events-auto" />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="preAuthRequired" />
                          <Label htmlFor="preAuthRequired">Pre-authorization Required</Label>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="preAuthNumber">Pre-authorization Number</Label>
                          <Input id="preAuthNumber" placeholder="Enter pre-auth number" />
                        </div>
                        <div className="space-y-2">
                          <Label>Claim Status</Label>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                        </div>
                        <div className="space-y-2 md:col-span-3">
                          <Label>Insurance Documents</Label>
                          <Button variant="outline" className="w-full">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Policy Documents
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Emergency Contacts Tab */}
          <TabsContent value="emergency" className="mt-6">
            <div className="max-w-6xl space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Guardian Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="guardianName">Guardian Name</Label>
                      <Input id="guardianName" placeholder="Enter guardian name" />
                    </div>
                    <div className="space-y-2">
                      <Label>Relationship</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="father">Father</SelectItem>
                          <SelectItem value="mother">Mother</SelectItem>
                          <SelectItem value="brother">Brother</SelectItem>
                          <SelectItem value="sister">Sister</SelectItem>
                          <SelectItem value="spouse">Spouse</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guardianContact">Guardian Contact Number</Label>
                      <Input id="guardianContact" placeholder="+91-9876543210" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="isEmergencyContact" />
                      <Label htmlFor="isEmergencyContact">Is Emergency Contact</Label>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="guardianAddress">Guardian Address</Label>
                      <Textarea id="guardianAddress" placeholder="Same as Patient or enter specific address" rows={3} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Emergency Contacts
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Contact
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Emergency Contact 1</h4>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="emergencyName1">Contact Name</Label>
                          <Input id="emergencyName1" placeholder="Enter contact name" />
                        </div>
                        <div className="space-y-2">
                          <Label>Relationship</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mother">Mother</SelectItem>
                              <SelectItem value="father">Father</SelectItem>
                              <SelectItem value="spouse">Spouse</SelectItem>
                              <SelectItem value="sibling">Sibling</SelectItem>
                              <SelectItem value="friend">Friend</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergencyPhone1">Contact Number</Label>
                          <Input id="emergencyPhone1" placeholder="+91-9876543211" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergencyAddress1">Address</Label>
                          <Input id="emergencyAddress1" placeholder="Enter address" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="emergencyNotes1">Notes</Label>
                          <Textarea id="emergencyNotes1" placeholder="Call only after 6 PM" rows={2} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <Button variant="outline" onClick={() => navigate("/patients")}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientEditPage;