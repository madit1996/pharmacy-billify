
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, ArrowRight, Calendar, CheckCircle, Clock, FileText, Home, Loader2, MapPin, User, History, Edit
} from "lucide-react";
import { LabTest, LabTestStatus } from "@/types/lab-tests";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Import the WorkflowProgress component
import WorkflowProgress from "./WorkflowProgress";

// Define a list of representatives for assigning tests
const representatives = [
  { id: "R1", name: "Dr. Sarah Smith", role: "Lab Technician" },
  { id: "R2", name: "Dr. Robert Johnson", role: "Pathologist" },
  { id: "R3", name: "Dr. Emily Williams", role: "Radiologist" },
  { id: "R4", name: "John Miller", role: "Lab Assistant" }
];

interface TestCardProps {
  test: LabTest;
  onSelectTest: (test: LabTest) => void;
  onUpdateWorkflow: (test: LabTest, newStatus: LabTestStatus, notes?: string, additionalInfo?: any) => void;
}

const TestCard = ({ test, onSelectTest, onUpdateWorkflow }: TestCardProps) => {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [selectedRepresentative, setSelectedRepresentative] = useState("");
  const { toast } = useToast();

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
  
  const getCurrentStepIndex = (test: LabTest): number => {
    const statuses = ['pending', 'sampling', 'processing', 'reporting', 'completed'];
    return statuses.indexOf(test.status);
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

  const handleUpdateStatus = () => {
    const nextStatus = getNextStatus(test.status);
    if (!nextStatus) return;
    
    const additionalInfo: any = {};
    
    if (selectedRepresentative) {
      const rep = representatives.find(r => r.id === selectedRepresentative);
      if (rep) {
        additionalInfo.performedBy = rep.id;
        additionalInfo.performerName = rep.name;
      }
    }
    
    onUpdateWorkflow(test, nextStatus, notes, additionalInfo);
    setIsUpdateDialogOpen(false);
    setNotes("");
    setSelectedRepresentative("");
    
    toast({
      title: "Test status updated",
      description: `${test.testName} moved to ${nextStatus} status`,
    });
  };

  return (
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
          {test.representativeId && (
            <div className="flex items-center mt-2 text-sm text-gray-600">
              <User className="h-3.5 w-3.5 mr-1 text-gray-500" />
              <span>Assigned to: {
                representatives.find(r => r.id === test.representativeId)?.name || 'Unknown'
              }</span>
            </div>
          )}
        </div>
        <Badge className={getStatusBadgeColor(test.status)}>
          {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
        </Badge>
      </div>
      
      <div className="space-y-4">
        {/* Workflow progress visualization */}
        <WorkflowProgress test={test} />
        
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsHistoryDialogOpen(true)}
            className="text-gray-500"
          >
            <History className="mr-1 h-4 w-4" />
            History
          </Button>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectTest(test)}
            >
              {test.status === 'reporting' ? (
                <>
                  <Edit className="mr-1 h-4 w-4" />
                  Report
                </>
              ) : (
                <>View Details</>
              )}
            </Button>
            
            {/* Only show next action button if there's a next status and not completed */}
            {test.status !== 'completed' && getNextStatus(test.status) && (
              <Button
                size="sm"
                onClick={() => setIsUpdateDialogOpen(true)}
              >
                Move to {getNextStatus(test.status)}
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Status Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Test Status</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="test-representative">Assign to Representative</Label>
              <Select 
                value={selectedRepresentative} 
                onValueChange={setSelectedRepresentative}
              >
                <SelectTrigger id="test-representative">
                  <SelectValue placeholder="Select a representative" />
                </SelectTrigger>
                <SelectContent>
                  {representatives.map(rep => (
                    <SelectItem key={rep.id} value={rep.id}>
                      {rep.name} ({rep.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="test-notes">Notes</Label>
              <Textarea
                id="test-notes"
                placeholder="Add notes about this status change"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setIsUpdateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateStatus}>
                Update to {getNextStatus(test.status)}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={isHistoryDialogOpen} onOpenChange={setIsHistoryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Test History</DialogTitle>
          </DialogHeader>
          
          <div className="max-h-[60vh] overflow-auto">
            {!test.workflowHistory || test.workflowHistory.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No history available for this test.</p>
            ) : (
              <div className="space-y-4">
                {test.workflowHistory.map((history, index) => (
                  <div 
                    key={index} 
                    className="border-l-2 border-blue-300 pl-4 py-2"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        {history.fromStatus} → {history.toStatus}
                      </span>
                      <span className="text-gray-500">
                        {history.timestamp.toLocaleString()}
                      </span>
                    </div>
                    
                    {history.performerName && (
                      <div className="text-sm mt-1 flex items-center text-gray-700">
                        <User className="h-3 w-3 mr-1" />
                        <span>{history.performerName}</span>
                      </div>
                    )}
                    
                    {history.notes && (
                      <p className="text-sm mt-1 text-gray-600">
                        {history.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TestCard;
