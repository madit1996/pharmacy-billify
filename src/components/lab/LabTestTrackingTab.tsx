
import { useLabContext } from "@/contexts/LabContext";
import { LabTest, LabTestStatus } from "@/types/lab-tests";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Activity, ArrowRight, Calendar, CheckCircle, Clock, 
  FileText, Home, Loader2, MapPin, Search, User 
} from "lucide-react";
import { useState } from "react";
import UploadTestResultForm from "./UploadTestResultForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";

// Function to get workflow steps
const getWorkflowSteps = (test: LabTest) => {
  const baseSteps = [
    { status: 'pending', label: 'Ordered', icon: Calendar },
    { status: 'sampling', label: 'Sample Collection', icon: FileText },
    { status: 'processing', label: 'Processing', icon: Loader2 },
    { status: 'reporting', label: 'Reporting', icon: Activity },
    { status: 'completed', label: 'Completed', icon: CheckCircle },
  ];
  
  return baseSteps;
};

// Function to get current step index
const getCurrentStepIndex = (test: LabTest): number => {
  const statuses = ['pending', 'sampling', 'processing', 'reporting', 'completed'];
  return statuses.indexOf(test.status);
};

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

  const { toast } = useToast();

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
    
    // Show toast notification
    toast({
      title: `Test status updated`,
      description: `${test.testName} moved to ${newStatus} stage`,
    });
    
    // If moving to reporting stage, open upload dialog
    if (newStatus === 'reporting') {
      handleSelectTest({...test, status: newStatus});
    }
  };

  const getNextStatus = (currentStatus: LabTestStatus): LabTestStatus | null => {
    const statusFlow: LabTestStatus[] = ['pending', 'sampling', 'processing', 'reporting', 'completed'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    
    if (currentIndex < statusFlow.length - 1) {
      return statusFlow[currentIndex + 1];
    }
    
    return null;
  };

  const getStatusBadgeColor = (status: LabTestStatus) => {
    switch (status) {
      case 'pending': return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case 'sampling': return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case 'processing': return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case 'reporting': return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200";
      case 'completed': return "bg-green-100 text-green-800 hover:bg-green-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Analytics Cards */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-blue-600">Pending Tests</p>
                <h3 className="text-3xl font-bold mt-1">{countByStatus('pending')}</h3>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <Progress 
              value={(countByStatus('pending') / allTests.length) * 100} 
              className="h-1 mt-4 bg-blue-100" 
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-purple-600">Processing</p>
                <h3 className="text-3xl font-bold mt-1">
                  {countByStatus('processing') + countByStatus('sampling')}
                </h3>
              </div>
              <div className="bg-purple-100 p-2 rounded-full">
                <Loader2 className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <Progress 
              value={((countByStatus('processing') + countByStatus('sampling')) / allTests.length) * 100} 
              className="h-1 mt-4 bg-purple-100" 
            />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-green-600">Completed</p>
                <h3 className="text-3xl font-bold mt-1">{countByStatus('completed')}</h3>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <Progress 
              value={(countByStatus('completed') / allTests.length) * 100} 
              className="h-1 mt-4 bg-green-100" 
            />
          </CardContent>
        </Card>

        {/* Home Collection Analytics */}
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-amber-600">Home Collections</p>
                <h3 className="text-3xl font-bold mt-1">{homeCollectionCount}</h3>
                <p className="text-xs text-amber-600 mt-1">
                  {pendingHomeCollections} pending collections
                </p>
              </div>
              <div className="bg-amber-100 p-2 rounded-full">
                <Home className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <Progress 
              value={(homeCollectionCount / allTests.length) * 100} 
              className="h-1 mt-4 bg-amber-100" 
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by patient name or test..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={filterPatient} onValueChange={setFilterPatient}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by patient" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-patients">All Patients</SelectItem>
            {getAllPatients().map((patient) => (
              <SelectItem key={patient.key} value={patient.key}>
                {patient.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="sampling">Sampling</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="reporting">Reporting</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        
        <Select 
          value={filterHomeCollection === null ? "all" : filterHomeCollection ? "home" : "lab"} 
          onValueChange={(value) => {
            if (value === "all") setFilterHomeCollection(null);
            else if (value === "home") setFilterHomeCollection(true);
            else setFilterHomeCollection(false);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Collection type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Collections</SelectItem>
            <SelectItem value="home">Home Collection</SelectItem>
            <SelectItem value="lab">Lab Collection</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
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
              {renderTestTable(orderedTests)}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Test Workflows</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {renderTestTable(orderedTests.filter(test => test.status !== 'completed'))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Tests</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {renderTestTable(orderedTests.filter(test => test.status === 'completed'))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="home" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Home Collection Tests</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {renderTestTable(orderedTests.filter(test => test.isHomeCollection))}
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
      
      {/* Helper function to render test tables */}
      {function renderTestTable(tests: LabTest[]) {
        if (tests.length === 0) {
          return (
            <div className="p-6 text-center text-gray-500">
              No tests match the selected filters
            </div>
          );
        }
        
        // Group tests by patient for better organization
        const testsByPatient: Record<string, LabTest[]> = {};
        tests.forEach(test => {
          if (!testsByPatient[test.patientId]) {
            testsByPatient[test.patientId] = [];
          }
          testsByPatient[test.patientId].push(test);
        });
        
        return (
          <div className="divide-y">
            {Object.entries(testsByPatient).map(([patientId, patientTests]) => (
              <div key={patientId} className="p-4">
                <div className="flex items-center mb-4">
                  <User className="h-5 w-5 mr-2 text-gray-500" />
                  <h3 className="font-medium">{patientTests[0].patientName}</h3>
                </div>
                
                <div className="space-y-4">
                  {patientTests.map(test => (
                    <div 
                      key={test.id} 
                      className={`border rounded-lg p-4 ${test.isHomeCollection ? 'bg-blue-50 border-blue-200' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">{test.testName}</h4>
                            {test.isHomeCollection && (
                              <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
                                <Home className="h-3 w-3" />
                                Home Collection
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            ID: {test.id} • Ordered: {test.orderedDate.toLocaleDateString()}
                          </p>
                          {test.isHomeCollection && test.collectionAddress && (
                            <div className="flex items-start mt-2 text-sm text-gray-600">
                              <MapPin className="h-3.5 w-3.5 mr-1 mt-0.5 text-gray-500" />
                              <span>{test.collectionAddress}</span>
                            </div>
                          )}
                        </div>
                        <Badge className={getStatusBadgeColor(test.status)}>
                          {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        {/* Workflow progress visualization */}
                        <div className="relative">
                          <div className="flex justify-between mb-2">
                            {getWorkflowSteps(test).map((step, idx) => {
                              const isComplete = idx <= getCurrentStepIndex(test);
                              const isCurrent = idx === getCurrentStepIndex(test);
                              
                              return (
                                <div 
                                  key={step.status} 
                                  className={`flex flex-col items-center ${
                                    isComplete ? 'text-blue-600' : 'text-gray-400'
                                  }`}
                                  style={{ width: `${100 / getWorkflowSteps(test).length}%` }}
                                >
                                  <div className={`
                                    rounded-full p-1.5
                                    ${isComplete ? 'bg-blue-100' : 'bg-gray-100'}
                                    ${isCurrent ? 'ring-2 ring-blue-300 ring-offset-2' : ''}
                                  `}>
                                    <step.icon className={`h-4 w-4 ${
                                      isComplete ? 'text-blue-600' : 'text-gray-400'
                                    }`} />
                                  </div>
                                  <span className="text-xs mt-1">{step.label}</span>
                                </div>
                              );
                            })}
                          </div>
                          <div className="absolute top-[14px] h-0.5 w-full bg-gray-100 -z-10" />
                          <div 
                            className="absolute top-[14px] h-0.5 bg-blue-500 -z-10"
                            style={{
                              width: `calc(${
                                (getCurrentStepIndex(test) / (getWorkflowSteps(test).length - 1)) * 100
                              }% - ${getCurrentStepIndex(test) > 0 ? 
                                (getCurrentStepIndex(test) / (getWorkflowSteps(test).length - 1)) * 16 : 0}px)`
                            }}
                          />
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectTest(test)}
                          >
                            View Details
                          </Button>
                          
                          {/* Only show next action button if there's a next status and not completed */}
                          {test.status !== 'completed' && getNextStatus(test.status) && (
                            <Button
                              size="sm"
                              onClick={() => {
                                const nextStatus = getNextStatus(test.status);
                                if (nextStatus) handleUpdateWorkflow(test, nextStatus);
                              }}
                            >
                              Move to {getNextStatus(test.status)}
                              <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      }}
    </div>
  );
};

export default LabTestTrackingTab;
