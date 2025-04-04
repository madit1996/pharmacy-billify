
import { useState } from "react";
import { useLabContext } from "@/contexts/LabContext";
import { LabTest, LabTestStatus } from "@/types/lab-tests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  Activity, CheckCircle, Clock, Home, Loader2
} from "lucide-react";
import UploadTestResultForm from "./UploadTestResultForm";

// Import the new components
import AnalyticsCard from "./tracking/AnalyticsCard";
import TestFilters from "./tracking/TestFilters";
import TestTable from "./tracking/TestTable";

const LabTestTrackingTab = () => {
  const { 
    pendingTests, 
    completedTests,
    handleUploadResult,
    handleCreateReport,
    updateTestWorkflow,
  } = useLabContext();

  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPatient, setFilterPatient] = useState("all-patients");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterHomeCollection, setFilterHomeCollection] = useState<boolean | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  // Combine all tests for tracking
  const allTests = [...pendingTests, ...completedTests];

  // Get unique patients
  const getAllPatients = () => {
    const patientMap = new Map();
    allTests.forEach(test => {
      if (!patientMap.has(test.patientId)) {
        patientMap.set(test.patientId, { key: test.patientId, name: test.patientName });
      }
    });
    return Array.from(patientMap.values());
  };

  // Filter tests based on search, patient, status and home collection
  const filteredTests = allTests.filter(test => {
    // Text search
    const matchesSearch = searchQuery === "" || 
      test.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Patient filter  
    const matchesPatient = filterPatient === "all-patients" || test.patientId === filterPatient;
    
    // Status filter
    const matchesStatus = filterStatus === "all" || test.status === filterStatus;

    // Home collection filter
    const matchesHomeCollection = filterHomeCollection === null || 
      test.isHomeCollection === filterHomeCollection;
    
    return matchesSearch && matchesPatient && matchesStatus && matchesHomeCollection;
  });

  // Count tests by status for analytics
  const countByStatus = (status: LabTestStatus) => {
    return allTests.filter(test => test.status === status).length;
  };

  // Count home collections
  const homeCollectionCount = allTests.filter(test => test.isHomeCollection).length;
  const pendingHomeCollections = allTests.filter(test => 
    test.isHomeCollection && (test.status === 'pending' || test.status === 'sampling')
  ).length;

  // Order tests by date (newest first)
  const orderedTests = [...filteredTests].sort((a, b) => 
    b.orderedDate.getTime() - a.orderedDate.getTime()
  );

  const handleSelectTest = (test: LabTest) => {
    setSelectedTest(test);
    
    // If test is in reporting stage, open upload dialog directly
    if (test.status === 'reporting') {
      setIsUploadDialogOpen(true);
    }
  };

  const handleUpdateWorkflow = (test: LabTest, newStatus: LabTestStatus, notes?: string) => {
    updateTestWorkflow(test.id, newStatus, notes);
    
    // If moving to reporting stage, open upload dialog
    if (newStatus === 'reporting') {
      handleSelectTest({...test, status: newStatus});
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Analytics Cards */}
        <AnalyticsCard
          title="Pending Tests"
          value={countByStatus('pending')}
          total={allTests.length}
          color="blue"
          icon={<Clock className="h-5 w-5 text-blue-600" />}
        />

        <AnalyticsCard
          title="Processing"
          value={countByStatus('processing') + countByStatus('sampling')}
          total={allTests.length}
          color="purple"
          icon={<Loader2 className="h-5 w-5 text-purple-600" />}
        />

        <AnalyticsCard
          title="Completed"
          value={countByStatus('completed')}
          total={allTests.length}
          color="green"
          icon={<CheckCircle className="h-5 w-5 text-green-600" />}
        />

        <AnalyticsCard
          title="Home Collections"
          value={homeCollectionCount}
          total={allTests.length}
          color="amber"
          icon={<Home className="h-5 w-5 text-amber-600" />}
          subtitle={`${pendingHomeCollections} pending collections`}
        />
      </div>

      <TestFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterPatient={filterPatient}
        setFilterPatient={setFilterPatient}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterHomeCollection={filterHomeCollection}
        setFilterHomeCollection={setFilterHomeCollection}
        patients={getAllPatients()}
      />
      
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Tests</TabsTrigger>
          <TabsTrigger value="active">Active Tests</TabsTrigger>
          <TabsTrigger value="completed">Completed Tests</TabsTrigger>
          <TabsTrigger value="home">Home Collections</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Test Workflows</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <TestTable 
                tests={orderedTests}
                onSelectTest={handleSelectTest}
                onUpdateWorkflow={handleUpdateWorkflow}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Test Workflows</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <TestTable 
                tests={orderedTests.filter(test => test.status !== 'completed')}
                onSelectTest={handleSelectTest}
                onUpdateWorkflow={handleUpdateWorkflow}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Tests</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <TestTable 
                tests={orderedTests.filter(test => test.status === 'completed')}
                onSelectTest={handleSelectTest}
                onUpdateWorkflow={handleUpdateWorkflow}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="home" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Home Collection Tests</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <TestTable 
                tests={orderedTests.filter(test => test.isHomeCollection)}
                onSelectTest={handleSelectTest}
                onUpdateWorkflow={handleUpdateWorkflow}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Test Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-4xl">
          {selectedTest && (
            <UploadTestResultForm
              test={selectedTest}
              onUpload={handleUploadResult}
              onCreateReport={handleCreateReport}
              onCancel={() => setIsUploadDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabTestTrackingTab;
