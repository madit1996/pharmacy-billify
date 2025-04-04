
import { useState } from "react";
import { useLabContext } from "@/contexts/LabContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
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
  XCircle,
  Check,
  ArrowRightCircle,
  MessageSquare,
  UserCircle2,
  Calendar,
  Search
} from "lucide-react";
import { LabTest, WorkflowHistoryItem } from "@/types/lab-tests";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const LabTestTrackingTab = () => {
  const { pendingTests, completedTests, updateTestWorkflow } = useLabContext();
  const [activeTab, setActiveTab] = useState<string>("sampling");
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Function to filter tests by search term
  const filterTests = (tests: LabTest[]) => {
    if (!searchTerm) return tests;
    return tests.filter(test => 
      test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  // Group tests by status
  const samplingTests = filterTests(pendingTests.filter(test => test.status === 'sampling'));
  const processingTests = filterTests(pendingTests.filter(test => test.status === 'processing'));
  const reportingTests = filterTests(pendingTests.filter(test => test.status === 'reporting'));
  const completedList = filterTests(completedTests);
  
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
        return <FlaskConical className="h-4 w-4 mr-2" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 mr-2" />;
      case 'reporting':
        return <ClipboardList className="h-4 w-4 mr-2" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 mr-2 text-green-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 mr-2" />;
    }
  };

  const viewTestHistory = (test: LabTest) => {
    setSelectedTest(test);
    setIsViewingHistory(true);
  };

  const TestCard = ({ test }: { test: LabTest }) => {
    const lastWorkflowItem = test.workflowHistory && test.workflowHistory.length > 0 
      ? test.workflowHistory[test.workflowHistory.length - 1] 
      : null;
      
    return (
      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-base">{test.testName}</h3>
              <p className="text-sm text-gray-500">{test.patientName}</p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-500">
                  {new Date(test.orderedDate).toLocaleDateString()}
                </span>
                {getStatusBadge(test.status)}
              </div>
            </div>
            <div className="flex flex-col items-end">
              <Badge variant="outline" className="mb-2">
                {test.category}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                onClick={() => viewTestHistory(test)}
              >
                <Clock className="h-3 w-3 mr-1" />
                History
              </Button>
            </div>
          </div>
          
          <div className="mt-3 border-t pt-3">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                  {test.doctorName}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-500">
                  ID: {test.id}
                </span>
                {lastWorkflowItem?.performerName && (
                  <span className="text-xs text-gray-500 flex items-center mt-1">
                    <UserCircle2 className="h-3 w-3 mr-1" />
                    {lastWorkflowItem.performerName}
                  </span>
                )}
              </div>
            </div>
            
            {/* Sample details if available */}
            {test.sampleDetails && (
              <div className="mt-2 pt-2 border-t border-dashed">
                <p className="text-xs text-gray-600">
                  <FlaskConical className="h-3 w-3 inline mr-1" />
                  Sample: {test.sampleDetails}
                </p>
              </div>
            )}
            
            {/* Last note if available */}
            {lastWorkflowItem?.notes && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 flex items-start">
                  <MessageSquare className="h-3 w-3 mr-1 mt-0.5" />
                  "{lastWorkflowItem.notes}"
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Test Tracking</h2>
        <div className="w-64">
          <Input 
            placeholder="Search tests or patients" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
            prefix={<Search className="w-4 h-4 text-gray-500" />}
          />
        </div>
      </div>
      
      <Tabs defaultValue="sampling" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="sampling" className="flex items-center">
              <FlaskConical className="h-4 w-4 mr-2" />
              <span>Sample Collection</span>
            </TabsTrigger>
            <TabsTrigger value="processing" className="flex items-center">
              <Loader2 className="h-4 w-4 mr-2" />
              <span>Processing</span>
            </TabsTrigger>
            <TabsTrigger value="reporting" className="flex items-center">
              <ClipboardList className="h-4 w-4 mr-2" />
              <span>Reporting</span>
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              <span>Completed</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
            <span className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
        
        <TabsContent value="sampling" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Sample Collection</CardTitle>
              <CardDescription>Tests awaiting sample collection</CardDescription>
            </CardHeader>
            <CardContent>
              {samplingTests.length > 0 ? (
                <div className="space-y-3">
                  {samplingTests.map(test => (
                    <TestCard key={test.id} test={test} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-500">No tests waiting for sample collection</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="processing" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Processing</CardTitle>
              <CardDescription>Tests currently being processed</CardDescription>
            </CardHeader>
            <CardContent>
              {processingTests.length > 0 ? (
                <div className="space-y-3">
                  {processingTests.map(test => (
                    <TestCard key={test.id} test={test} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-500">No tests currently in processing</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reporting" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Reporting</CardTitle>
              <CardDescription>Tests awaiting final report generation</CardDescription>
            </CardHeader>
            <CardContent>
              {reportingTests.length > 0 ? (
                <div className="space-y-3">
                  {reportingTests.map(test => (
                    <TestCard key={test.id} test={test} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-500">No tests waiting for report generation</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Completed</CardTitle>
              <CardDescription>Tests with final results</CardDescription>
            </CardHeader>
            <CardContent>
              {completedList.length > 0 ? (
                <div className="space-y-3">
                  {completedList.map(test => (
                    <TestCard key={test.id} test={test} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <AlertTriangle className="h-10 w-10 text-amber-400 mx-auto mb-3" />
                  <p className="text-gray-500">No completed tests found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Test History Dialog */}
      <Dialog open={isViewingHistory} onOpenChange={setIsViewingHistory}>
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
                    
                    <div className="relative border-l border-gray-200 pl-6">
                      {selectedTest.workflowHistory.map((item, index) => (
                        <div key={index} className="mb-6 relative">
                          {/* Timeline dot */}
                          <div className="absolute -left-9 mt-1.5 w-4 h-4 rounded-full bg-white border border-gray-300 flex items-center justify-center">
                            {getStatusIcon(item.toStatus)}
                          </div>
                          
                          <div className="border rounded-lg p-3 bg-white">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                {getStatusBadge(item.toStatus)}
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(item.timestamp).toLocaleString()}
                              </span>
                            </div>
                            
                            {item.performerName && (
                              <div className="mt-2">
                                <span className="text-sm flex items-center">
                                  <UserCircle2 className="h-4 w-4 mr-1 text-blue-500" />
                                  Performed by: {item.performerName}
                                </span>
                              </div>
                            )}
                            
                            {item.notes && (
                              <div className="mt-2">
                                <p className="text-sm flex items-start">
                                  <MessageSquare className="h-4 w-4 mr-1 mt-0.5 text-gray-500" />
                                  <span className="italic">"{item.notes}"</span>
                                </p>
                              </div>
                            )}
                            
                            {/* Status-specific details */}
                            {item.sampleDetails && (
                              <div className="mt-2 pt-2 border-t border-dashed">
                                <p className="text-sm">
                                  <FlaskConical className="h-4 w-4 inline mr-1 text-purple-500" />
                                  Sample Details: {item.sampleDetails}
                                </p>
                              </div>
                            )}
                            
                            {item.processingDetails && (
                              <div className="mt-2 pt-2 border-t border-dashed">
                                <p className="text-sm">
                                  <Loader2 className="h-4 w-4 inline mr-1 text-amber-500" />
                                  Processing Details: {item.processingDetails}
                                </p>
                              </div>
                            )}
                            
                            {item.reportingDetails && (
                              <div className="mt-2 pt-2 border-t border-dashed">
                                <p className="text-sm">
                                  <ClipboardList className="h-4 w-4 inline mr-1 text-blue-500" />
                                  Report Details: {item.reportingDetails}
                                </p>
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
            <Button onClick={() => setIsViewingHistory(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabTestTrackingTab;
