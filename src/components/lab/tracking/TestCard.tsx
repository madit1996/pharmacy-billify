
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, ArrowRight, Calendar, CheckCircle, Clock, FileText, Home, Loader2, MapPin
} from "lucide-react";
import { LabTest, LabTestStatus } from "@/types/lab-tests";

// Import the WorkflowProgress component
import WorkflowProgress from "./WorkflowProgress";

interface TestCardProps {
  test: LabTest;
  onSelectTest: (test: LabTest) => void;
  onUpdateWorkflow: (test: LabTest, newStatus: LabTestStatus, notes?: string) => void;
}

const TestCard = ({ test, onSelectTest, onUpdateWorkflow }: TestCardProps) => {
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
        </div>
        <Badge className={getStatusBadgeColor(test.status)}>
          {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
        </Badge>
      </div>
      
      <div className="space-y-4">
        {/* Workflow progress visualization */}
        <WorkflowProgress test={test} />
        
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectTest(test)}
          >
            View Details
          </Button>
          
          {/* Only show next action button if there's a next status and not completed */}
          {test.status !== 'completed' && getNextStatus(test.status) && (
            <Button
              size="sm"
              onClick={() => {
                const nextStatus = getNextStatus(test.status);
                if (nextStatus) onUpdateWorkflow(test, nextStatus);
              }}
            >
              Move to {getNextStatus(test.status)}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestCard;
