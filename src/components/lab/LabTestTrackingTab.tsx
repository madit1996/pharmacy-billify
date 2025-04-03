
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
  XCircle,
  Check,
  ArrowRightCircle
} from "lucide-react";
import { LabTest } from "@/types/lab-tests";

const LabTestTrackingTab = () => {
  const { pendingTests, completedTests } = useLabContext();
  const [activeTab, setActiveTab] = useState<string>("sampling");
  
  // Group tests by status
  const samplingTests = pendingTests.filter(test => !test.completedDate).slice(0, 5);
  const processingTests = pendingTests.filter(test => !test.completedDate).slice(5, 10);
  const reportingTests = pendingTests.filter(test => !test.completedDate).slice(10, 15);
  
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

  const TestCard = ({ test, stage }: { test: LabTest, stage: string }) => {
    const [status, setStatus] = useState(stage);
    
    const handleAdvance = () => {
      let nextStatus: string;
      
      switch(status) {
        case 'sampling':
          nextStatus = 'processing';
          break;
        case 'processing':
          nextStatus = 'reporting';
          break;
        case 'reporting':
          nextStatus = 'completed';
          break;
        default:
          nextStatus = status;
      }
      
      setStatus(nextStatus);
    };
    
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
                {getStatusBadge(status)}
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
                onClick={handleAdvance}
                disabled={status === 'completed'}
              >
                {status === 'completed' ? (
                  <Check className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowRightCircle className="h-3 w-3 mr-1" />
                )}
                {status === 'completed' ? 'Done' : 'Advance'}
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
              <span className="text-xs text-gray-500">
                ID: {test.id}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Test Tracking</h2>
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
                    <TestCard key={test.id} test={test} stage="sampling" />
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
                    <TestCard key={test.id} test={test} stage="processing" />
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
                    <TestCard key={test.id} test={test} stage="reporting" />
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
      </Tabs>
    </div>
  );
};

export default LabTestTrackingTab;
