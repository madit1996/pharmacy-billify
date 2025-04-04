
import { useState } from "react";
import { useLabContext } from "@/contexts/LabContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  Clock, 
  FlaskConical, 
  Loader2, 
  ClipboardList,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  UserCircle2,
  Search,
  Filter,
  RotateCw
} from "lucide-react";
import { LabTest, LabTestStatus, WorkflowHistoryItem } from "@/types/lab-tests";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { LabTestRepresentative } from "@/types/lab-types";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Define workflow stages
const WORKFLOW_STAGES = [
  { id: "sampling", name: "Sample Collection", icon: FlaskConical },
  { id: "processing", name: "Lab Processing", icon: Loader2 },
  { id: "reporting", name: "Report Creation", icon: ClipboardList },
  { id: "completed", name: "Completed", icon: CheckCircle },
];

// Define representatives (this would normally come from a database)
const REPRESENTATIVES: LabTestRepresentative[] = [
  { id: "rep1", name: "Dr. Jane Smith", role: "Lab Technician", specialty: "Blood Work" },
  { id: "rep2", name: "Dr. John Davis", role: "Lab Technician", specialty: "Microbiology" },
  { id: "rep3", name: "Dr. Sarah Johnson", role: "Pathologist", specialty: "Histopathology" },
  { id: "rep4", name: "Dr. Michael Chen", role: "Radiologist", specialty: "X-ray Analysis" },
  { id: "rep5", name: "Dr. Lisa Wong", role: "Lab Supervisor", specialty: "General" },
];

const LabTestTrackingTab = () => {
  const { pendingTests, completedTests, updateTestWorkflow } = useLabContext();
  const [activeStage, setActiveStage] = useState<LabTestStatus>("sampling");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedPatientFilter, setSelectedPatientFilter] = useState<string>("");
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  
  // Dialog states
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isWorkflowDialogOpen, setIsWorkflowDialogOpen] = useState(false);
  const [nextStage, setNextStage] = useState<string>("");
  const [workflowNote, setWorkflowNote] = useState("");
  const [selectedRep, setSelectedRep] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  
  // Function to filter tests by search term
  const filterTests = (tests: LabTest[]) => {
    if (!searchTerm && !selectedPatientFilter) return tests;
    
    return tests.filter(test => {
      const matchesSearch = !searchTerm || 
        test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.patientId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPatient = !selectedPatientFilter || 
        `${test.patientId}-${test.patientName}` === selectedPatientFilter;
      
      return matchesSearch && matchesPatient;
    });
  };

  // Group tests by status
  const getTestsByStatus = (status: LabTestStatus) => {
    const tests = status === 'completed' ? 
      filterTests(completedTests) : 
      filterTests(pendingTests.filter(test => test.status === status));
    
    return groupTestsByPatient(tests);
  };
  
  // Group tests by patient
  const groupTestsByPatient = (tests: LabTest[]) => {
    const grouped = tests.reduce((acc, test) => {
      const key = `${test.patientId}-${test.patientName}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(test);
      return acc;
    }, {} as Record<string, LabTest[]>);
    
    return grouped;
  };
  
  // Get all unique patients from pending and completed tests
  const getAllPatients = () => {
    const allTests = [...pendingTests, ...completedTests];
    const uniquePatients = new Map();
    
    allTests.forEach(test => {
      const key = `${test.patientId}-${test.patientName}`;
      if (!uniquePatients.has(key)) {
        uniquePatients.set(key, {
          id: test.patientId,
          name: test.patientName,
          key
        });
      }
    });
    
    return Array.from(uniquePatients.values());
  };
  
  const groupedTests = getTestsByStatus(activeStage);
  
  // Open dialog with test information for viewing history
  const viewTestHistory = (test: LabTest) => {
    setSelectedTest(test);
    setIsHistoryDialogOpen(true);
  };
  
  // Open dialog for advancing workflow stage
  const openAdvanceDialog = (test: LabTest) => {
    const currentStageIndex = WORKFLOW_STAGES.findIndex(stage => stage.id === test.status);
    
    if (currentStageIndex < WORKFLOW_STAGES.length - 1) {
      const nextStageId = WORKFLOW_STAGES[currentStageIndex + 1].id;
      setSelectedTest(test);
      setNextStage(nextStageId);
      setWorkflowNote("");
      setSelectedRep("");
      setAdditionalDetails("");
      setIsWorkflowDialogOpen(true);
    }
  };
  
  // Open dialog with test information for reverting stage
  const openRevertDialog = (test: LabTest) => {
    const currentStageIndex = WORKFLOW_STAGES.findIndex(stage => stage.id === test.status);
    
    if (currentStageIndex > 0) {
      const prevStageId = WORKFLOW_STAGES[currentStageIndex - 1].id;
      setSelectedTest(test);
      setNextStage(prevStageId);
      setWorkflowNote("");
      setSelectedRep("");
      setAdditionalDetails("");
      setIsWorkflowDialogOpen(true);
    }
  };
  
  // Handle workflow stage change with notes and representative
  const handleWorkflowChange = () => {
    if (!selectedTest) return;
    
    const performerName = selectedRep ? 
      REPRESENTATIVES.find(rep => rep.id === selectedRep)?.name : undefined;
    
    let detailsField = {};
    if (nextStage === "sampling") {
      detailsField = { sampleDetails: additionalDetails };
    } else if (nextStage === "processing") {
      detailsField = { processingDetails: additionalDetails };
    } else if (nextStage === "reporting") {
      detailsField = { reportingDetails: additionalDetails };
    }
    
    const historyItem: Partial<WorkflowHistoryItem> = {
      notes: workflowNote,
      performedBy: selectedRep || undefined,
      performerName,
      ...detailsField
    };
    
    updateTestWorkflow(selectedTest.id, nextStage, workflowNote, historyItem);
    setIsWorkflowDialogOpen(false);
    
    // If we've moved to a different stage, update the active stage to follow the test
    if (nextStage !== activeStage) {
      setActiveStage(nextStage as LabTestStatus);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="ml-2">Pending</Badge>;
      case 'sampling':
        return <Badge variant="secondary" className="ml-2">Sampling</Badge>;
      case 'processing':
        return <Badge variant="default" className="ml-2 bg-amber-500">Processing</Badge>;
      case 'reporting':
        return <Badge variant="default" className="ml-2 bg-blue-500">Reporting</Badge>;
      case 'completed':
        return <Badge variant="default" className="ml-2 bg-green-500">Completed</Badge>;
      default:
        return <Badge variant="destructive" className="ml-2">Unknown</Badge>;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'sampling': 
        return <FlaskConical className="h-4 w-4 text-purple-500" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 text-amber-500" />;
      case 'reporting':
        return <ClipboardList className="h-4 w-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };
  
  // Patient test card component
  const PatientTestGroup = ({ patientKey, tests }: { patientKey: string, tests: LabTest[] }) => {
    const [patientId, patientName] = patientKey.split('-');
    
    return (
      <Card key={patientKey} className="mb-4">
        <CardHeader className="py-2 px-3 bg-slate-50">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center">
              {patientName}
              <Badge variant="outline" className="ml-2 text-xs">
                ID: {patientId}
              </Badge>
            </CardTitle>
            <Badge variant="outline" className="bg-slate-100">
              {tests.length} {tests.length === 1 ? 'test' : 'tests'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-3 space-y-2">
          {tests.map((test) => (
            <div key={test.id} className="border rounded-md p-3 bg-white hover:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    {getStatusIcon(test.status)}
                    <h4 className="font-medium text-sm ml-2">{test.testName}</h4>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{test.category || 'General'}</p>
                  <div className="mt-1 flex items-center">
                    {getStatusBadge(test.status)}
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <div className="flex space-x-1 mb-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => openRevertDialog(test)}
                      disabled={test.status === 'sampling' || test.status === 'completed'}
                    >
                      <ArrowLeft className="h-3 w-3 mr-1" />
                      Back
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => openAdvanceDialog(test)}
                      disabled={test.status === 'completed'}
                    >
                      {test.status === 'reporting' ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowRight className="h-3 w-3 mr-1" />
                      )}
                      {test.status === 'reporting' ? 'Complete' : 'Next'}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => viewTestHistory(test)}
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      History
                    </Button>
                  </div>
                  
                  {test.estimatedCompletionTime && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      Est: {new Date(test.estimatedCompletionTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Representative info */}
              {test.representativeId && (
                <div className="mt-2 pt-2 border-t border-dashed text-xs text-gray-600">
                  <UserCircle2 className="h-3 w-3 inline mr-1" />
                  {REPRESENTATIVES.find(rep => rep.id === test.representativeId)?.name || 'Assigned Staff'}
                </div>
              )}
              
              {/* Sample info */}
              {test.sampleDetails && (
                <div className="mt-1 text-xs text-gray-600">
                  <FlaskConical className="h-3 w-3 inline mr-1" />
                  Sample: {test.sampleDetails}
                </div>
              )}
              
              {/* Last workflow note if available */}
              {test.workflowHistory && test.workflowHistory.length > 0 && (
                <div className="mt-2 pt-2 border-t border-dashed">
                  <p className="text-xs text-gray-500 flex items-start">
                    <MessageSquare className="h-3 w-3 mr-1 mt-0.5" />
                    "{test.workflowHistory[test.workflowHistory.length - 1].notes || 'No notes'}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };
  
  const EmptyStateMessage = () => (
    <div className="text-center py-10">
      <AlertTriangle className="h-10 w-10 text-amber-400 mx-auto mb-3 opacity-50" />
      <p className="text-gray-500">No tests in this stage</p>
      <div className="flex justify-center mt-2 space-x-2">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => {
            setSearchTerm("");
            setSelectedPatientFilter("");
          }}
        >
          <RotateCw className="h-3 w-3 mr-1" />
          Clear filters
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Test Workflow & Tracking</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search tests or patients" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-8"
            />
          </div>
          <Select
            value={selectedPatientFilter}
            onValueChange={setSelectedPatientFilter}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by patient" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Patients</SelectItem>
              {getAllPatients().map((patient) => (
                <SelectItem key={patient.key} value={patient.key}>
                  {patient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="sampling" value={activeStage} onValueChange={(value) => setActiveStage(value as LabTestStatus)}>
        <TabsList className="mb-4 w-full flex overflow-x-auto">
          {WORKFLOW_STAGES.map((stage) => (
            <TabsTrigger key={stage.id} value={stage.id} className="flex-1 flex items-center justify-center">
              <stage.icon className="h-4 w-4 mr-2" />
              <span>{stage.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        
        {WORKFLOW_STAGES.map((stage) => (
          <TabsContent key={stage.id} value={stage.id} className="mt-0 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>{stage.name}</CardTitle>
                <CardDescription>
                  {stage.id === 'sampling' && 'Tests awaiting sample collection'}
                  {stage.id === 'processing' && 'Tests currently being processed'}
                  {stage.id === 'reporting' && 'Tests awaiting final report generation'}
                  {stage.id === 'completed' && 'Tests with final results'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="max-h-[600px] pr-4">
                  {Object.keys(groupedTests).length > 0 ? (
                    Object.entries(groupedTests).map(([patientKey, tests]) => (
                      <PatientTestGroup key={patientKey} patientKey={patientKey} tests={tests} />
                    ))
                  ) : (
                    <EmptyStateMessage />
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Test History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <div>Test Workflow History</div>
              {selectedTest && getStatusBadge(selectedTest.status)}
            </DialogTitle>
          </DialogHeader>
          
          {selectedTest && (
            <ScrollArea className="max-h-[400px] overflow-auto pr-4">
              <div className="space-y-4 py-4">
                <div className="bg-slate-50 p-4 rounded-md">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Test Name</p>
                      <p>{selectedTest.testName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Patient</p>
                      <p>{selectedTest.patientName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Ordered Date</p>
                      <p>{new Date(selectedTest.orderedDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Doctor</p>
                      <p>{selectedTest.doctorName}</p>
                    </div>
                    {selectedTest.sampleId && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Sample ID</p>
                        <p>{selectedTest.sampleId}</p>
                      </div>
                    )}
                    {selectedTest.category && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Category</p>
                        <p>{selectedTest.category}</p>
                      </div>
                    )}
                  </div>
                  
                  {selectedTest.sampleDetails && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm font-medium text-gray-500">Sample Details</p>
                      <p className="text-sm">{selectedTest.sampleDetails}</p>
                    </div>
                  )}
                </div>
                
                {(!selectedTest.workflowHistory || selectedTest.workflowHistory.length === 0) ? (
                  <div className="text-center py-6">
                    <AlertTriangle className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                    <p>No workflow history available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">Workflow Timeline</h3>
                    
                    <div className="relative border-l-2 border-gray-200 pl-6 ml-4">
                      {selectedTest.workflowHistory.map((item, index) => (
                        <div key={index} className="mb-6 relative">
                          {/* Timeline dot */}
                          <div className="absolute -left-9 mt-1.5 w-6 h-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                            {getStatusIcon(item.toStatus)}
                          </div>
                          
                          <div className="border rounded-lg p-4 bg-white">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                {getStatusBadge(item.toStatus)}
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(item.timestamp).toLocaleString()}
                              </span>
                            </div>
                            
                            {item.performerName && (
                              <div className="mb-2">
                                <span className="text-sm flex items-center text-gray-700">
                                  <UserCircle2 className="h-4 w-4 mr-1 text-blue-500" />
                                  Performed by: {item.performerName}
                                </span>
                              </div>
                            )}
                            
                            {item.notes && (
                              <div className="mb-2 bg-slate-50 p-2 rounded-md">
                                <p className="text-sm flex items-start">
                                  <MessageSquare className="h-4 w-4 mr-1 mt-0.5 text-gray-500" />
                                  <span className="italic">"{item.notes}"</span>
                                </p>
                              </div>
                            )}
                            
                            {/* Status-specific details */}
                            {(item.sampleDetails || item.processingDetails || item.reportingDetails) && (
                              <div className="mt-2 pt-2 border-t border-dashed">
                                {item.sampleDetails && (
                                  <p className="text-sm my-1">
                                    <FlaskConical className="h-4 w-4 inline mr-1 text-purple-500" />
                                    Sample: {item.sampleDetails}
                                  </p>
                                )}
                                
                                {item.processingDetails && (
                                  <p className="text-sm my-1">
                                    <Loader2 className="h-4 w-4 inline mr-1 text-amber-500" />
                                    Processing: {item.processingDetails}
                                  </p>
                                )}
                                
                                {item.reportingDetails && (
                                  <p className="text-sm my-1">
                                    <ClipboardList className="h-4 w-4 inline mr-1 text-blue-500" />
                                    Report: {item.reportingDetails}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsHistoryDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Workflow Update Dialog */}
      <Dialog open={isWorkflowDialogOpen} onOpenChange={setIsWorkflowDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {nextStage === selectedTest?.status ? "Revert to" : "Advance to"} {
                WORKFLOW_STAGES.find(stage => stage.id === nextStage)?.name || nextStage
              }
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {selectedTest && (
              <div className="bg-slate-50 p-3 rounded-md mb-4">
                <p className="font-medium">{selectedTest.testName}</p>
                <p className="text-sm text-gray-600">Patient: {selectedTest.patientName}</p>
                <div className="flex items-center mt-1">
                  <p className="text-sm text-gray-600 mr-2">Current Status:</p>
                  {getStatusBadge(selectedTest.status)}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Assigned Representative</label>
              <Select value={selectedRep} onValueChange={setSelectedRep}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a representative" />
                </SelectTrigger>
                <SelectContent>
                  {REPRESENTATIVES.map(rep => (
                    <SelectItem key={rep.id} value={rep.id}>
                      {rep.name} ({rep.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea 
                value={workflowNote} 
                onChange={(e) => setWorkflowNote(e.target.value)}
                placeholder="Add notes about this workflow change..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {nextStage === "sampling" && "Sample Details"}
                {nextStage === "processing" && "Processing Details"}
                {nextStage === "reporting" && "Report Details"}
                {nextStage === "completed" && "Completion Details"}
              </label>
              <Textarea 
                value={additionalDetails} 
                onChange={(e) => setAdditionalDetails(e.target.value)}
                placeholder={`Add any ${nextStage} specific details...`}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWorkflowDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleWorkflowChange}>Save & Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabTestTrackingTab;
