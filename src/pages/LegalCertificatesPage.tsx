
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, AlertTriangle, Shield, Baby } from "lucide-react";
import CertificateRequestsTab from "@/components/legal/CertificateRequestsTab";
import MLCTrackingTab from "@/components/legal/MLCTrackingTab";
import ConsentAuditTab from "@/components/legal/ConsentAuditTab";

const LegalCertificatesPage = () => {
  const [activeTab, setActiveTab] = useState("certificates");

  const legalStats = {
    pendingCertificates: 12,
    activeMLC: 3,
    pendingConsents: 8,
    completedAudits: 45
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Legal & Certificates</h1>
          <p className="text-gray-600">Manage certificates, MLC cases, and consent forms</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Certificates</p>
                <p className="text-2xl font-bold text-orange-600">{legalStats.pendingCertificates}</p>
              </div>
              <FileText className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active MLC Cases</p>
                <p className="text-2xl font-bold text-red-600">{legalStats.activeMLC}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Consents</p>
                <p className="text-2xl font-bold text-yellow-600">{legalStats.pendingConsents}</p>
              </div>
              <Shield className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Audits</p>
                <p className="text-2xl font-bold text-green-600">{legalStats.completedAudits}</p>
              </div>
              <Baby className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="certificates">Certificate Requests</TabsTrigger>
          <TabsTrigger value="mlc">MLC Tracking</TabsTrigger>
          <TabsTrigger value="consent">Consent Audit</TabsTrigger>
        </TabsList>

        <TabsContent value="certificates" className="space-y-4">
          <CertificateRequestsTab />
        </TabsContent>

        <TabsContent value="mlc" className="space-y-4">
          <MLCTrackingTab />
        </TabsContent>

        <TabsContent value="consent" className="space-y-4">
          <ConsentAuditTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LegalCertificatesPage;
