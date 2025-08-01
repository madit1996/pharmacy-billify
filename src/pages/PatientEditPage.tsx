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
import { EmergencyContactForm } from "@/components/patient-edit/EmergencyContactForm";
import { InsurancePolicyForm } from "@/components/patient-edit/InsurancePolicyForm";
import { AddressForm } from "@/components/patient-edit/AddressForm";
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
  DollarSign,
  TrendingUp,
  Calendar as CalendarDays,
  Building,
  Heart,
  UserPlus,
  Receipt
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
  
  // Editing states for different sections
  const [editingContactId, setEditingContactId] = useState<number | null>(null);
  const [editingPolicyId, setEditingPolicyId] = useState<number | null>(null);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);

  // Enhanced patient data with new features
  const [patientData, setPatientData] = useState({
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
    // Enhanced HMIS Details
    mrnNumber: "MRN-2025-001234",
    patientCategory: "General",
    firstServiceUsed: "Laboratory",
    firstVisitDate: new Date("2025-07-17"),
    referringDoctor: "",
    currentTreatmentStatus: "Ongoing",
    medicalRecordStatus: "Active",
    registrationDate: new Date("2025-07-17"),
    source: "Walk-in",
    status: "Active",
    isInactive: false,
    // Contact details
    mobile1: "+91-7889846115",
    alternateMobile: "+91-9876543210", // NEW: Alternate mobile
    otpVerified: true,
    phone1: "",
    phone2: "",
    allowSMS: true,
    email: "aditya.mahajan@example.com",
    alternateEmail: "",
    website: "",
    allowEmail: true,
    // Primary Emergency Contact (moved to basic section)
    primaryEmergencyContact: {
      name: "Sunita Devi",
      relationship: "Mother",
      phone: "+91-9876543211"
    },
    // Financial Summary Data
    financialSummary: {
      lifetimeValue: 125000,
      totalBillAmount: 75000,
      totalPaidAmount: 73500,
      pendingAmount: 1500,
      visitCount: 12,
      lastVisitDate: new Date("2025-07-15")
    },
    // Address
    addressType: "Common",
    address1: "H.No S8/835 Prabha Niwas, Lane No 5 East",
    address2: "Opposite shri Thakur Dwar mandir, Patel Nagar",
    city: "Pathankot",
    state: "Punjab",
    country: "India",
    pincode: "145001",
    printAddress: true,
    // Additional Addresses (multiple)
    additionalAddresses: [
      {
        id: 1,
        type: "Work",
        address1: "TechPark Tower, IT City",
        address2: "Sector 62",
        city: "Noida",
        state: "Uttar Pradesh",
        pincode: "201301",
        phone: "+91-1234567890",
        email: "work@aditya.com",
        gstin: "09ABCDE1234F1Z5",
        isDefault: false
      }
    ],
    // Insurance Policies (multiple)
    insurancePolicies: [
      {
        id: 1,
        company: "Star Health Insurance",
        policyNumber: "POL123456789",
        type: "Private",
        policyHolder: "Aditya Mahajan",
        coverageAmount: 500000,
        status: "Active",
        expiryDate: new Date("2025-12-31"),
        preAuthRequired: true,
        isPrimary: true
      },
      {
        id: 2,
        company: "ICICI Lombard",
        policyNumber: "POL987654321",
        type: "Corporate",
        policyHolder: "Aditya Mahajan",
        coverageAmount: 200000,
        status: "Active",
        expiryDate: new Date("2025-10-15"),
        preAuthRequired: false,
        isPrimary: false
      }
    ],
    // Emergency Contacts (multiple)
    emergencyContacts: [
      {
        id: 1,
        name: "Sunita Devi",
        relationship: "Mother",
        phone: "+91-9876543211",
        address: "Same as patient",
        notes: "Primary contact",
        isPrimary: true
      },
      {
        id: 2,
        name: "Raj Kumar Mahajan",
        relationship: "Father",
        phone: "+91-9876543212",
        address: "Same as patient",
        notes: "Secondary contact",
        isPrimary: false
      }
    ],
    // Relationships & Groups
    familyMembers: [
      {
        id: 1,
        name: "Sunita Devi",
        relationship: "Mother",
        patientId: "PAT-18",
        phone: "+91-9876543211"
      }
    ],
    patientGroups: ["VIP", "Corporate - TechCorp"],
    // GSTIN & Business Details
    gstinDetails: [
      {
        id: 1,
        gstin: "03ABCDE1234F1Z5",
        businessName: "Mahajan Enterprises",
        address: "H.No S8/835 Prabha Niwas, Lane No 5 East, Pathankot",
        isDefault: true
      }
    ],
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
  });

  // Functions to handle adding new items
  const addNewEmergencyContact = () => {
    const newContact = {
      id: patientData.emergencyContacts.length + 1,
      name: "",
      relationship: "",
      phone: "",
      address: "",
      notes: "",
      isPrimary: false
    };
    setPatientData(prev => ({
      ...prev,
      emergencyContacts: [...prev.emergencyContacts, newContact]
    }));
    // Auto-enter edit mode for new contact
    setTimeout(() => setEditingContactId(newContact.id), 100);
    toast({
      title: "New Contact Added",
      description: "A new emergency contact has been added. Please fill in the details.",
    });
  };

  const addNewInsurancePolicy = () => {
    const newPolicy = {
      id: patientData.insurancePolicies.length + 1,
      company: "",
      policyNumber: "",
      type: "Private",
      policyHolder: "",
      coverageAmount: 0,
      status: "Active",
      expiryDate: new Date(),
      preAuthRequired: false,
      isPrimary: false
    };
    setPatientData(prev => ({
      ...prev,
      insurancePolicies: [...prev.insurancePolicies, newPolicy]
    }));
    // Auto-enter edit mode for new policy
    setTimeout(() => setEditingPolicyId(newPolicy.id), 100);
    toast({
      title: "New Policy Added",
      description: "A new insurance policy has been added. Please fill in the details.",
    });
  };

  const addNewAddress = () => {
    const newAddress = {
      id: patientData.additionalAddresses.length + 1,
      type: "Other",
      address1: "",
      address2: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      email: "",
      gstin: "",
      isDefault: false
    };
    setPatientData(prev => ({
      ...prev,
      additionalAddresses: [...prev.additionalAddresses, newAddress]
    }));
    // Auto-enter edit mode for new address
    setTimeout(() => setEditingAddressId(newAddress.id), 100);
    toast({
      title: "New Address Added",
      description: "A new address has been added. Please fill in the details.",
    });
  };

  const addNewGSTIN = () => {
    const newGSTIN = {
      id: patientData.gstinDetails.length + 1,
      gstin: "",
      businessName: "",
      address: "",
      isDefault: false
    };
    setPatientData(prev => ({
      ...prev,
      gstinDetails: [...prev.gstinDetails, newGSTIN]
    }));
    toast({
      title: "New GSTIN Added",
      description: "A new GSTIN entry has been added. Please fill in the details.",
    });
  };

  // Emergency Contact editing functions
  const handleEditContact = (contactId: number) => {
    setEditingContactId(contactId);
  };

  const handleSaveContact = (updatedContact: any) => {
    setPatientData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.map(contact => 
        contact.id === updatedContact.id ? updatedContact : contact
      )
    }));
    setEditingContactId(null);
    toast({
      title: "Contact Updated",
      description: "Emergency contact has been updated successfully.",
    });
  };

  const handleCancelContactEdit = () => {
    setEditingContactId(null);
  };

  const handleDeleteContact = (contactId: number) => {
    setPatientData(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter(contact => contact.id !== contactId)
    }));
    toast({
      title: "Contact Deleted",
      description: "Emergency contact has been removed.",
    });
  };

  // Insurance Policy editing functions
  const handleEditPolicy = (policyId: number) => {
    setEditingPolicyId(policyId);
  };

  const handleSavePolicy = (updatedPolicy: any) => {
    setPatientData(prev => ({
      ...prev,
      insurancePolicies: prev.insurancePolicies.map(policy => 
        policy.id === updatedPolicy.id ? updatedPolicy : policy
      )
    }));
    setEditingPolicyId(null);
    toast({
      title: "Policy Updated",
      description: "Insurance policy has been updated successfully.",
    });
  };

  const handleCancelPolicyEdit = () => {
    setEditingPolicyId(null);
  };

  const handleDeletePolicy = (policyId: number) => {
    setPatientData(prev => ({
      ...prev,
      insurancePolicies: prev.insurancePolicies.filter(policy => policy.id !== policyId)
    }));
    toast({
      title: "Policy Deleted",
      description: "Insurance policy has been removed.",
    });
  };

  // Address editing functions
  const handleEditAddress = (addressId: number) => {
    setEditingAddressId(addressId);
  };

  const handleSaveAddress = (updatedAddress: any) => {
    setPatientData(prev => ({
      ...prev,
      additionalAddresses: prev.additionalAddresses.map(address => 
        address.id === updatedAddress.id ? updatedAddress : address
      )
    }));
    setEditingAddressId(null);
    toast({
      title: "Address Updated",
      description: "Address has been updated successfully.",
    });
  };

  const handleCancelAddressEdit = () => {
    setEditingAddressId(null);
  };

  const handleDeleteAddress = (addressId: number) => {
    setPatientData(prev => ({
      ...prev,
      additionalAddresses: prev.additionalAddresses.filter(address => address.id !== addressId)
    }));
    toast({
      title: "Address Deleted",
      description: "Address has been removed.",
    });
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
        {/* Financial Summary Dashboard */}
        <Card className="mb-6 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              Patient Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-purple-600" />
                  <Label className="text-sm font-medium text-muted-foreground">Lifetime Value</Label>
                </div>
                <p className="text-2xl font-bold text-purple-600">₹{patientData.financialSummary.lifetimeValue.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Receipt className="h-4 w-4 text-blue-600" />
                  <Label className="text-sm font-medium text-muted-foreground">Total Bill</Label>
                </div>
                <p className="text-2xl font-bold text-blue-600">₹{patientData.financialSummary.totalBillAmount.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <Label className="text-sm font-medium text-muted-foreground">Amount Paid</Label>
                </div>
                <p className="text-2xl font-bold text-green-600">₹{patientData.financialSummary.totalPaidAmount.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-4 w-4 text-orange-600" />
                  <Label className="text-sm font-medium text-muted-foreground">Pending</Label>
                </div>
                <p className="text-2xl font-bold text-orange-600">₹{patientData.financialSummary.pendingAmount.toLocaleString()}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDays className="h-4 w-4 text-indigo-600" />
                  <Label className="text-sm font-medium text-muted-foreground">Total Visits</Label>
                </div>
                <p className="text-2xl font-bold text-indigo-600">{patientData.financialSummary.visitCount}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Heart className="h-4 w-4 text-pink-600" />
                  <Label className="text-sm font-medium text-muted-foreground">Last Visit</Label>
                </div>
                <p className="text-lg font-semibold text-pink-600">{format(patientData.financialSummary.lastVisitDate, "MMM dd")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <Label htmlFor="alternateMobile">Alternate Mobile Number</Label>
                <Input id="alternateMobile" defaultValue={patientData.alternateMobile} />
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
                <Label htmlFor="mrnNumber">MRN Number</Label>
                <Input id="mrnNumber" value="MRN-2025-001234" readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Patient Category</Label>
                <Select defaultValue="General">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="Corporate">Corporate</SelectItem>
                    <SelectItem value="Staff">Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>First Service Used</Label>
                <Select defaultValue="Laboratory">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="Laboratory">Laboratory</SelectItem>
                    <SelectItem value="OPD">OPD Consultation</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="IPD">IPD</SelectItem>
                    <SelectItem value="Specialized">Specialized Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="referringDoctor">Referring Doctor/Hospital</Label>
                <Input id="referringDoctor" defaultValue="" placeholder="Optional" />
              </div>
              <div className="space-y-2">
                <Label>Current Treatment Status</Label>
                <Select defaultValue="Ongoing">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Discharged">Discharged</SelectItem>
                    <SelectItem value="Follow-up">Follow-up Required</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Medical Record Status</Label>
                <Select defaultValue="Active">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Archived">Archived</SelectItem>
                    <SelectItem value="Transferred">Transferred</SelectItem>
                  </SelectContent>
                </Select>
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

        {/* Emergency Contact Information - Dedicated Section */}
        <Card className="mb-6 border-2 border-orange-200 bg-orange-50/30">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Phone className="h-6 w-6 text-orange-600" />
                Emergency Contact Information
              </CardTitle>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700" onClick={addNewEmergencyContact}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Contact
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patientData.emergencyContacts.map((contact) => (
                <EmergencyContactForm
                  key={contact.id}
                  contact={contact}
                  isEditing={editingContactId === contact.id}
                  onSave={handleSaveContact}
                  onCancel={handleCancelContactEdit}
                  onDelete={handleDeleteContact}
                  onEdit={() => handleEditContact(contact.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insurance Information - Always Visible Dedicated Section */}
        <Card className="mb-6 border-2 border-blue-200 bg-blue-50/30">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-xl">
                <CreditCard className="h-6 w-6 text-blue-600" />
                Insurance Information
              </CardTitle>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={addNewInsurancePolicy}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Policy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patientData.insurancePolicies.map((policy) => (
                <InsurancePolicyForm
                  key={policy.id}
                  policy={policy}
                  isEditing={editingPolicyId === policy.id}
                  onSave={handleSavePolicy}
                  onCancel={handleCancelPolicyEdit}
                  onDelete={handleDeletePolicy}
                  onEdit={() => handleEditPolicy(policy.id)}
                />
              ))}
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
                  Billing & Financial
                </TabsTrigger>
                <TabsTrigger value="addresses" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Additional Addresses
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documents & IDs
                </TabsTrigger>
                <TabsTrigger value="gstin" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  GSTIN & Tax
                </TabsTrigger>
                <TabsTrigger value="relationships" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Relationships & Groups
                </TabsTrigger>
                <TabsTrigger value="other" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Other Details
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

              {/* Additional Addresses Tab */}
              <TabsContent value="addresses" className="mt-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Additional Addresses</h3>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={addNewAddress}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Address
                    </Button>
                  </div>
                  
                  {patientData.additionalAddresses.map((address) => (
                    <AddressForm
                      key={address.id}
                      address={address}
                      isEditing={editingAddressId === address.id}
                      onSave={handleSaveAddress}
                      onCancel={handleCancelAddressEdit}
                      onDelete={handleDeleteAddress}
                      onEdit={() => handleEditAddress(address.id)}
                    />
                  ))}
                    <Card key={address.id} className={`border-2 ${address.isDefault ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-lg">{address.type} Address</h4>
                            {address.isDefault && (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Default</Badge>
                            )}
                          </div>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Address Type</Label>
                            <Select defaultValue={address.type}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Work">Work</SelectItem>
                                <SelectItem value="Temporary">Temporary</SelectItem>
                                <SelectItem value="Permanent">Permanent</SelectItem>
                                <SelectItem value="Billing">Billing</SelectItem>
                                <SelectItem value="Shipping">Shipping</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`address${address.id}Line1`}>Address Line 1</Label>
                            <Input id={`address${address.id}Line1`} defaultValue={address.address1} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`address${address.id}Line2`}>Address Line 2</Label>
                            <Input id={`address${address.id}Line2`} defaultValue={address.address2} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`address${address.id}City`}>City</Label>
                            <Input id={`address${address.id}City`} defaultValue={address.city} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`address${address.id}State`}>State</Label>
                            <Input id={`address${address.id}State`} defaultValue={address.state} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`address${address.id}Pincode`}>Pincode</Label>
                            <Input id={`address${address.id}Pincode`} defaultValue={address.pincode} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`address${address.id}Phone`}>Phone</Label>
                            <Input id={`address${address.id}Phone`} defaultValue={address.phone} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`address${address.id}Email`}>Email</Label>
                            <Input id={`address${address.id}Email`} type="email" defaultValue={address.email} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`address${address.id}Gstin`}>GSTIN</Label>
                            <Input id={`address${address.id}Gstin`} defaultValue={address.gstin} />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id={`address${address.id}Default`} checked={address.isDefault} />
                            <Label htmlFor={`address${address.id}Default`}>Set as Default</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* GSTIN & Tax Details Tab */}
              <TabsContent value="gstin" className="mt-6">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">GSTIN & Business Details</h3>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={addNewGSTIN}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New GSTIN
                    </Button>
                  </div>
                  
                  {patientData.gstinDetails.map((gstin, index) => (
                    <Card key={gstin.id} className={`border-2 ${gstin.isDefault ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-lg">{gstin.businessName}</h4>
                            {gstin.isDefault && (
                              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Default</Badge>
                            )}
                          </div>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`gstin${gstin.id}`}>GSTIN Number</Label>
                            <Input id={`gstin${gstin.id}`} defaultValue={gstin.gstin} />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`businessName${gstin.id}`}>Business Name</Label>
                            <Input id={`businessName${gstin.id}`} defaultValue={gstin.businessName} />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor={`businessAddress${gstin.id}`}>Business Address</Label>
                            <Textarea id={`businessAddress${gstin.id}`} defaultValue={gstin.address} rows={3} />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id={`gstinDefault${gstin.id}`} checked={gstin.isDefault} />
                            <Label htmlFor={`gstinDefault${gstin.id}`}>Set as Default</Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Card className="border-2 border-dashed border-gray-300">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Tax Exemption Category</Label>
                          <Select defaultValue="None">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="None">None</SelectItem>
                              <SelectItem value="Senior Citizen">Senior Citizen</SelectItem>
                              <SelectItem value="Government Employee">Government Employee</SelectItem>
                              <SelectItem value="Medical Insurance">Medical Insurance</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="taxExemptionNumber">Tax Exemption Number</Label>
                          <Input id="taxExemptionNumber" placeholder="Enter exemption number if applicable" />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="isTaxExempt" />
                          <Label htmlFor="isTaxExempt">Tax Exempt Patient</Label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Relationships & Groups Tab */}
              <TabsContent value="relationships" className="mt-6">
                <div className="space-y-6">
                  {/* Family Members Section */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Family Members</h3>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Link Family Member
                      </Button>
                    </div>
                    
                    {patientData.familyMembers.map((member, index) => (
                      <Card key={member.id} className="border-2 border-blue-200 bg-blue-50">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                                <p className="font-semibold">{member.name}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Relationship</Label>
                                <p className="font-semibold">{member.relationship}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Patient ID</Label>
                                <p className="font-semibold">{member.patientId}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                                <p className="font-semibold">{member.phone}</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Patient Groups Section */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Patient Groups</h3>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Group
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {patientData.patientGroups.map((group, index) => (
                        <Badge key={index} className="bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1">
                          {group}
                          <button className="ml-2 hover:text-red-600">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    
                    <Card className="border-2 border-dashed border-gray-300">
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Add to Group</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select group" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="VIP">VIP</SelectItem>
                                <SelectItem value="Corporate">Corporate</SelectItem>
                                <SelectItem value="Insurance">Insurance</SelectItem>
                                <SelectItem value="Senior Citizen">Senior Citizen</SelectItem>
                                <SelectItem value="Staff">Staff</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="customGroup">Or Create New Group</Label>
                            <Input id="customGroup" placeholder="Enter custom group name" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Additional Emergency Contacts */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Additional Emergency Contacts</h3>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Emergency Contact
                      </Button>
                    </div>
                    
                    {patientData.emergencyContacts.filter(contact => !contact.isPrimary).map((contact, index) => (
                      <Card key={contact.id} className="border-2 border-orange-200 bg-orange-50">
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                                <p className="font-semibold">{contact.name}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Relationship</Label>
                                <p className="font-semibold">{contact.relationship}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                                <p className="font-semibold">{contact.phone}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-muted-foreground">Notes</Label>
                                <p className="font-semibold">{contact.notes}</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Documents & IDs Tab */}
              <TabsContent value="documents" className="mt-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Identification Documents & Uploads</h3>
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
                        Upload ID Documents
                      </Button>
                    </div>
                  </div>
                  
                  <Card className="border-2 border-dashed border-gray-300">
                    <CardHeader>
                      <CardTitle className="text-lg">Medical Records & Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" className="h-20 flex flex-col">
                          <Upload className="h-6 w-6 mb-2" />
                          Upload Medical Reports
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col">
                          <FileText className="h-6 w-6 mb-2" />
                          Upload Prescriptions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Other Details Tab */}
              <TabsContent value="other" className="mt-6">
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Personal Demographics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      <Label htmlFor="education">Education Level</Label>
                      <Input id="education" defaultValue={patientData.education} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="motherTongue">Mother Tongue</Label>
                      <Input id="motherTongue" defaultValue={patientData.motherTongue} />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mt-8">Additional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="specialNeeds">Special Needs/Disabilities</Label>
                      <Textarea id="specialNeeds" placeholder="Any special accommodations needed" rows={3} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="allergies">Known Allergies</Label>
                      <Textarea id="allergies" placeholder="List any known allergies" rows={3} />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="remarks">General Remarks/Notes</Label>
                      <Textarea id="remarks" placeholder="Additional notes about the patient" rows={4} />
                    </div>
                  </div>
                  
                  <Card className="border-2 border-dashed border-gray-300">
                    <CardHeader>
                      <CardTitle className="text-lg">Miscellaneous Attachments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full h-16">
                        <Upload className="h-6 w-6 mr-2" />
                        Upload Additional Files
                      </Button>
                    </CardContent>
                  </Card>
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
