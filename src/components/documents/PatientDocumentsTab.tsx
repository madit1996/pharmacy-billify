import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CalendarIcon,
  FileText,
  Pill,
  TestTube,
  Camera,
  Receipt,
  Shield,
  Stethoscope,
  FileImage
} from "lucide-react";
import { format } from "date-fns";
import { Document, DocumentType, DocumentFilter } from "@/types/document-types";

interface PatientDocumentsTabProps {
  patientId: string;
}

// Mock documents data
const mockDocuments: Document[] = [
  {
    id: "PER001",
    type: "prescription",
    title: "General Medicine Prescription",
    patientId: "PAT-18",
    appointmentId: "72",
    doctorId: "DOC-01",
    doctorName: "Dr. Kartik",
    department: "OPD",
    createdAt: new Date("2025-07-25T17:15:00"),
    updatedAt: new Date("2025-07-25T17:15:00"),
    status: "generated",
    referenceNumber: "PER001"
  },
  {
    id: "LAB001",
    type: "lab-report",
    title: "Complete Blood Count Report",
    patientId: "PAT-18",
    appointmentId: "72",
    doctorId: "DOC-01",
    doctorName: "Dr. Kartik",
    department: "Lab",
    createdAt: new Date("2025-07-26T10:30:00"),
    updatedAt: new Date("2025-07-26T10:30:00"),
    status: "signed",
    referenceNumber: "LAB001"
  },
  {
    id: "RAD001",
    type: "radiology-report",
    title: "Chest X-Ray Report",
    patientId: "PAT-18",
    appointmentId: "71",
    doctorId: "DOC-01",
    doctorName: "Dr. Kartik",
    department: "Radiology",
    createdAt: new Date("2025-07-24T14:20:00"),
    updatedAt: new Date("2025-07-24T14:20:00"),
    status: "signed",
    referenceNumber: "RAD001"
  },
  {
    id: "VAC001",
    type: "vaccination-record",
    title: "COVID-19 Vaccination Certificate",
    patientId: "PAT-18",
    appointmentId: "70",
    doctorId: "DOC-02",
    doctorName: "Dr. Rajeev",
    department: "Vaccination",
    createdAt: new Date("2025-07-20T11:00:00"),
    updatedAt: new Date("2025-07-20T11:00:00"),
    status: "delivered",
    referenceNumber: "VAC001"
  },
  {
    id: "INV001",
    type: "invoice",
    title: "Consultation Invoice",
    patientId: "PAT-18",
    appointmentId: "72",
    doctorId: "DOC-01",
    doctorName: "Dr. Kartik",
    department: "Billing",
    createdAt: new Date("2025-07-25T17:45:00"),
    updatedAt: new Date("2025-07-25T17:45:00"),
    status: "generated",
    referenceNumber: "INV001"
  },
  {
    id: "OPD001",
    type: "opd-notes",
    title: "OPD Consultation Notes",
    patientId: "PAT-18",
    appointmentId: "72",
    doctorId: "DOC-01",
    doctorName: "Dr. Kartik",
    department: "OPD",
    createdAt: new Date("2025-07-25T17:00:00"),
    updatedAt: new Date("2025-07-25T17:00:00"),
    status: "generated",
    referenceNumber: "OPD001"
  }
];

const PatientDocumentsTab = ({ patientId }: PatientDocumentsTabProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date>();

  const documentTypes: { value: DocumentType; label: string; icon: any }[] = [
    { value: 'prescription', label: 'Prescriptions', icon: Pill },
    { value: 'lab-report', label: 'Lab Reports', icon: TestTube },
    { value: 'radiology-report', label: 'Radiology Reports', icon: Camera },
    { value: 'opd-notes', label: 'OPD Notes', icon: Stethoscope },
    { value: 'vaccination-record', label: 'Vaccinations', icon: Shield },
    { value: 'invoice', label: 'Invoices', icon: Receipt },
    { value: 'medical-certificate', label: 'Certificates', icon: FileImage },
    { value: 'discharge-summary', label: 'Discharge Summary', icon: FileText }
  ];

  const getDocumentIcon = (type: DocumentType) => {
    const docType = documentTypes.find(dt => dt.value === type);
    const IconComponent = docType?.icon || FileText;
    return <IconComponent className="h-4 w-4" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      case 'generated':
        return <Badge className="bg-blue-100 text-blue-800">Generated</Badge>;
      case 'signed':
        return <Badge className="bg-green-100 text-green-800">Signed</Badge>;
      case 'delivered':
        return <Badge className="bg-purple-100 text-purple-800">Delivered</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Filter documents
  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = searchTerm === "" || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "all" || doc.type === selectedType;
    const matchesDepartment = selectedDepartment === "all" || doc.department === selectedDepartment;
    const matchesStatus = selectedStatus === "all" || doc.status === selectedStatus;

    return matchesSearch && matchesType && matchesDepartment && matchesStatus;
  });

  const uniqueDepartments = Array.from(new Set(mockDocuments.map(d => d.department))).sort();

  const getDocumentStats = () => {
    const total = mockDocuments.length;
    const prescriptions = mockDocuments.filter(d => d.type === 'prescription').length;
    const labReports = mockDocuments.filter(d => d.type === 'lab-report').length;
    const radiology = mockDocuments.filter(d => d.type === 'radiology-report').length;
    
    return { total, prescriptions, labReports, radiology };
  };

  const stats = getDocumentStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Total Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Pill className="h-4 w-4" />
              Prescriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.prescriptions}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Lab Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.labReports}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Radiology
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.radiology}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Document Repository</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search documents by title, reference, or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Document Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {documentTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {uniqueDepartments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="generated">Generated</SelectItem>
                  <SelectItem value="signed">Signed</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-40">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                  />
                </PopoverContent>
              </Popover>

              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Documents Table */}
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Type</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((document) => (
                  <TableRow key={document.id} className="hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getDocumentIcon(document.type)}
                        <span className="text-sm font-medium capitalize">
                          {document.type.replace('-', ' ')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono font-medium">
                      {document.referenceNumber}
                    </TableCell>
                    <TableCell className="font-medium">
                      {document.title}
                    </TableCell>
                    <TableCell>{document.doctorName}</TableCell>
                    <TableCell>{document.department}</TableCell>
                    <TableCell>{format(document.createdAt, "PPP")}</TableCell>
                    <TableCell>{getStatusBadge(document.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No documents found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientDocumentsTab;