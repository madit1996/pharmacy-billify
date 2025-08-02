import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  Clock, 
  User, 
  Stethoscope,
  Pill,
  TestTube,
  Camera,
  Receipt,
  Shield
} from "lucide-react";
import { AppointmentDocumentSummary } from "@/types/document-types";
import { format } from "date-fns";

interface DocumentSummaryDialogProps {
  appointmentId: string;
  isOpen: boolean;
  onClose: () => void;
}

// Mock data for demonstration
const mockDocumentSummary: AppointmentDocumentSummary = {
  appointmentId: "72",
  patientName: "Priya Jain",
  appointmentDate: new Date("2025-07-25T17:00:00"),
  doctorName: "Dr. Kartik",
  duration: 45,
  totalDocuments: 6,
  documents: [
    {
      id: "PER001",
      type: "prescription",
      title: "Prescription - General Medicine",
      patientId: "PAT-18",
      appointmentId: "72",
      doctorId: "DOC-01",
      doctorName: "Dr. Kartik",
      department: "OPD",
      createdAt: new Date("2025-07-25T17:15:00"),
      updatedAt: new Date("2025-07-25T17:15:00"),
      status: "generated",
      referenceNumber: "PER001",
      content: {
        medications: [
          { name: "Paracetamol", dosage: "500mg", frequency: "Twice daily" },
          { name: "Amoxicillin", dosage: "250mg", frequency: "Three times daily" }
        ]
      }
    },
    {
      id: "LAB001",
      type: "test-request",
      title: "Lab Test Request - Blood Panel",
      patientId: "PAT-18",
      appointmentId: "72",
      doctorId: "DOC-01",
      doctorName: "Dr. Kartik",
      department: "Lab",
      createdAt: new Date("2025-07-25T17:20:00"),
      updatedAt: new Date("2025-07-25T17:20:00"),
      status: "generated",
      referenceNumber: "LAB001",
      content: {
        tests: ["Complete Blood Count", "Liver Function Test", "Kidney Function Test"]
      }
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
      referenceNumber: "INV001",
      content: {
        amount: 1200,
        items: [
          { name: "OPD Consultation", amount: 600 },
          { name: "Lab Tests", amount: 600 }
        ]
      }
    }
  ],
  prescriptions: [],
  labRequests: [],
  radiologyOrders: [],
  opdNotes: [],
  invoices: [],
  vaccinations: [],
  dischargeSummaries: [],
  internalNotes: [
    "Patient reported mild fever and headache",
    "Blood pressure: 120/80 mmHg",
    "Recommended follow-up in 1 week"
  ]
};

const DocumentSummaryDialog = ({ appointmentId, isOpen, onClose }: DocumentSummaryDialogProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  // In a real app, this would fetch data based on appointmentId
  const documentSummary = mockDocumentSummary;

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'prescription': return <Pill className="h-4 w-4" />;
      case 'test-request': return <TestTube className="h-4 w-4" />;
      case 'lab-report': return <TestTube className="h-4 w-4" />;
      case 'radiology-report': return <Camera className="h-4 w-4" />;
      case 'invoice': return <Receipt className="h-4 w-4" />;
      case 'vaccination-record': return <Shield className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Summary - Appointment #{appointmentId}
          </DialogTitle>
        </DialogHeader>

        {/* Appointment Header */}
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Patient</p>
                  <p className="font-medium">{documentSummary.patientName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Doctor</p>
                  <p className="font-medium">{documentSummary.doctorName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{format(documentSummary.appointmentDate, "PPP")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{documentSummary.duration} minutes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">All Documents</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Total Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{documentSummary.totalDocuments}</p>
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
                  <p className="text-2xl font-bold">
                    {documentSummary.documents.filter(d => d.type === 'prescription').length}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TestTube className="h-4 w-4" />
                    Lab Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {documentSummary.documents.filter(d => d.type === 'test-request').length}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Internal Notes */}
            {documentSummary.internalNotes && documentSummary.internalNotes.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Clinical Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {documentSummary.internalNotes.map((note, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        • {note}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <div className="space-y-3">
              {documentSummary.documents.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getDocumentIcon(doc.type)}
                        <div>
                          <h4 className="font-medium">{doc.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {doc.referenceNumber} • {doc.department} • {format(doc.createdAt, "PPp")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(doc.status)}
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <div className="space-y-4">
              {documentSummary.documents
                .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
                .map((doc, index) => (
                  <div key={doc.id} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="rounded-full bg-primary p-2">
                        {getDocumentIcon(doc.type)}
                      </div>
                      {index < documentSummary.documents.length - 1 && (
                        <div className="w-px h-8 bg-border mt-2"></div>
                      )}
                    </div>
                    <Card className="flex-1">
                      <CardContent className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{doc.title}</h4>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(doc.status)}
                            <span className="text-xs text-muted-foreground">
                              {format(doc.createdAt, "HH:mm")}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Generated by {doc.doctorName} in {doc.department}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentSummaryDialog;