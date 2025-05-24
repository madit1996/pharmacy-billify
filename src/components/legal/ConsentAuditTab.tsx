
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, Shield, AlertCircle } from "lucide-react";

type ConsentForm = {
  id: string;
  formId: string;
  patientName: string;
  consentType: "Surgery" | "Procedure" | "Treatment" | "Anesthesia" | "Blood Transfusion";
  department: string;
  doctorName: string;
  consentDate: string;
  witnessName: string;
  status: "Obtained" | "Pending" | "Refused" | "Expired";
  validUntil: string;
  riskLevel: "High" | "Medium" | "Low";
};

const ConsentAuditTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const consentForms: ConsentForm[] = [
    {
      id: "1",
      formId: "CONSENT001",
      patientName: "John Doe",
      consentType: "Surgery",
      department: "Cardiology",
      doctorName: "Dr. Smith",
      consentDate: "2024-01-15",
      witnessName: "Nurse Mary",
      status: "Obtained",
      validUntil: "2024-01-22",
      riskLevel: "High"
    },
    {
      id: "2",
      formId: "CONSENT002",
      patientName: "Jane Wilson",
      consentType: "Blood Transfusion",
      department: "Emergency",
      doctorName: "Dr. Johnson",
      consentDate: "2024-01-16",
      witnessName: "Nurse Alice",
      status: "Obtained",
      validUntil: "2024-01-20",
      riskLevel: "Medium"
    },
    {
      id: "3",
      formId: "CONSENT003",
      patientName: "Robert Brown",
      consentType: "Anesthesia",
      department: "Orthopedics",
      doctorName: "Dr. Davis",
      consentDate: "",
      witnessName: "",
      status: "Pending",
      validUntil: "",
      riskLevel: "High"
    }
  ];

  const consentTypes = ["all", "Surgery", "Procedure", "Treatment", "Anesthesia", "Blood Transfusion"];
  const statuses = ["all", "Obtained", "Pending", "Refused", "Expired"];

  const filteredForms = consentForms.filter(form => {
    const matchesSearch = form.formId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         form.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || form.consentType === typeFilter;
    const matchesStatus = statusFilter === "all" || form.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: ConsentForm["status"]) => {
    const statusConfig = {
      "Obtained": "bg-green-100 text-green-800",
      "Pending": "bg-yellow-100 text-yellow-800",
      "Refused": "bg-red-100 text-red-800",
      "Expired": "bg-gray-100 text-gray-800"
    };

    return (
      <Badge className={statusConfig[status]}>
        {status}
      </Badge>
    );
  };

  const getRiskBadge = (risk: ConsentForm["riskLevel"]) => {
    const riskConfig = {
      "High": "bg-red-100 text-red-800",
      "Medium": "bg-yellow-100 text-yellow-800",
      "Low": "bg-green-100 text-green-800"
    };

    return (
      <Badge className={riskConfig[risk]}>
        {risk}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-blue-500" />
              Consent Form Audit
            </CardTitle>
            <Button>
              <AlertCircle className="mr-2 h-4 w-4" />
              Generate Audit Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by form ID or patient name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                {consentTypes.map(type => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? "All Types" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === "all" ? "All Status" : status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Consent Forms Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Form ID</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Consent Type</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Consent Date</TableHead>
                  <TableHead>Witness</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredForms.map((form) => (
                  <TableRow key={form.id}>
                    <TableCell className="font-medium">{form.formId}</TableCell>
                    <TableCell>{form.patientName}</TableCell>
                    <TableCell>{form.consentType}</TableCell>
                    <TableCell>{form.department}</TableCell>
                    <TableCell>{form.doctorName}</TableCell>
                    <TableCell>{form.consentDate || "-"}</TableCell>
                    <TableCell>{form.witnessName || "-"}</TableCell>
                    <TableCell>{form.validUntil || "-"}</TableCell>
                    <TableCell>{getRiskBadge(form.riskLevel)}</TableCell>
                    <TableCell>{getStatusBadge(form.status)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsentAuditTab;
