
import { useState } from "react";
import { useLabContext } from "@/contexts/LabContext";
import { 
  FlaskConical, 
  ListChecks, 
  FileText, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Clock,
  RotateCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LabTest } from "@/types/lab-tests";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Define workflow stages
const WORKFLOW_STAGES = [
  { id: "sampling", name: "Sample Collection", icon: FlaskConical },
  { id: "processing", name: "Lab Processing", icon: ListChecks },
  { id: "reporting", name: "Report Creation", icon: FileText },
  { id: "completed", name: "Completed", icon: CheckCircle2 },
];

const LabWorkflowPanel = () => {
  const { pendingTests, completedTests, updateTestWorkflow } = useLabContext();
  const [activeStage, setActiveStage] = useState<string>("sampling");
  const [filterPatient, setFilterPatient] = useState<string>("");
  
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
  
  // Get tests for the active workflow stage
  const getStageTests = () => {
    const allTests = [...pendingTests, ...completedTests];
    
    // Filter by stage/status
    const filteredTests = allTests.filter(test => {
      if (activeStage === "completed") {
        return test.status === "completed";
      }
      return test.status === activeStage;
    });
    
    // Filter by patient name/id if filter is set
    const patientFiltered = filterPatient 
      ? filteredTests.filter(test => 
          test.patientName.toLowerCase().includes(filterPatient.toLowerCase()) ||
          test.patientId.toLowerCase().includes(filterPatient.toLowerCase())
        )
      : filteredTests;
    
    return groupTestsByPatient(patientFiltered);
  };
  
  const groupedTests = getStageTests();
  
  // Handle workflow stage change
  const handleAdvanceStage = (test: LabTest) => {
    let nextStage = "";
    
    // Find the next stage
    const currentStageIndex = WORKFLOW_STAGES.findIndex(stage => stage.id === test.status);
    if (currentStageIndex < WORKFLOW_STAGES.length - 1) {
      nextStage = WORKFLOW_STAGES[currentStageIndex + 1].id;
    }
    
    if (nextStage) {
      updateTestWorkflow(test.id, nextStage);
    }
  };
  
  const handleRevertStage = (test: LabTest) => {
    const currentStageIndex = WORKFLOW_STAGES.findIndex(stage => stage.id === test.status);
    
    if (currentStageIndex > 0) {
      const prevStage = WORKFLOW_STAGES[currentStageIndex - 1].id;
      updateTestWorkflow(test.id, prevStage);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'sampling':
        return <Badge variant="secondary" className="ml-2">Sample Collection</Badge>;
      case 'processing':
        return <Badge variant="default" className="ml-2 bg-amber-500">Processing</Badge>;
      case 'reporting':
        return <Badge variant="default" className="ml-2 bg-blue-500">Reporting</Badge>;
      case 'completed':
        return <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      default:
        return <Badge variant="destructive" className="ml-2">Unknown</Badge>;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-slate-50">
        <h3 className="text-lg font-medium mb-2">Test Workflow</h3>
        
        <div className="mb-3">
          <Input 
            placeholder="Filter by patient name or ID" 
            value={filterPatient}
            onChange={(e) => setFilterPatient(e.target.value)}
            className="w-full"
          />
        </div>
        
        <Tabs value={activeStage} onValueChange={setActiveStage}>
          <TabsList className="grid grid-cols-4 mb-2">
            {WORKFLOW_STAGES.map((stage) => (
              <TabsTrigger key={stage.id} value={stage.id} className="text-xs">
                <stage.icon className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">{stage.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {Object.keys(groupedTests).length > 0 ? (
            Object.entries(groupedTests).map(([patientKey, tests]) => {
              const [patientId, patientName] = patientKey.split('-');
              
              return (
                <Card key={patientKey} className="mb-4">
                  <CardHeader className="py-2 px-3 bg-slate-50">
                    <CardTitle className="text-sm font-medium flex items-center">
                      {patientName}
                      <Badge variant="outline" className="ml-2 text-xs">
                        ID: {patientId}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 space-y-2">
                    {tests.map((test) => (
                      <div key={test.id} className="border rounded-md p-3 bg-white">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-sm">{test.testName}</h4>
                            <p className="text-xs text-gray-500">{test.category || 'General'}</p>
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
                                onClick={() => handleRevertStage(test)}
                                disabled={test.status === 'sampling' || test.status === 'completed'}
                              >
                                <ArrowLeft className="h-3 w-3 mr-1" />
                                Back
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => handleAdvanceStage(test)}
                                disabled={test.status === 'completed'}
                              >
                                {test.status === 'reporting' ? (
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                ) : (
                                  <ArrowRight className="h-3 w-3 mr-1" />
                                )}
                                {test.status === 'reporting' ? 'Complete' : 'Next'}
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
                        
                        {/* Sample info - conditional rendering */}
                        {test.sampleDetails && (
                          <div className="mt-2 pt-2 border-t border-dashed text-xs text-gray-500">
                            <p>Sample: {test.sampleDetails}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="text-center py-10">
              <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-3 opacity-50" />
              <p className="text-gray-500">No tests in this stage</p>
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2"
                onClick={() => setFilterPatient("")}
              >
                <RotateCw className="h-3 w-3 mr-1" />
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LabWorkflowPanel;
