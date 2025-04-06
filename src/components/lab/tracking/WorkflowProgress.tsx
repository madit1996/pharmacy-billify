
import { LabTest, LabTestStatus } from "@/types/lab-tests";
import { 
  Activity, Calendar, CheckCircle, FileText, Loader2 
} from "lucide-react";

interface WorkflowProgressProps {
  test: LabTest;
  representatives?: { id: string; name: string; role: string }[];
  getLastRepresentativeForStatus?: (test: LabTest, status: LabTestStatus) => string | null;
}

const WorkflowProgress = ({ 
  test, 
  representatives,
  getLastRepresentativeForStatus 
}: WorkflowProgressProps) => {
  const steps = [
    { status: 'pending', label: 'Ordered', icon: Calendar },
    { status: 'sampling', label: 'Sample Collection', icon: FileText },
    { status: 'processing', label: 'Processing', icon: Loader2 },
    { status: 'reporting', label: 'Reporting', icon: Activity },
    { status: 'completed', label: 'Completed', icon: CheckCircle },
  ];
  
  const statuses = steps.map(step => step.status as LabTestStatus);
  const currentStepIndex = statuses.indexOf(test.status);
  
  return (
    <div className="flex items-center space-x-1">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isCurrent = index === currentStepIndex;
        const isPast = index < currentStepIndex;
        const isFuture = index > currentStepIndex;
        
        // Determine the representative who handled this step
        const representative = getLastRepresentativeForStatus?.(test, step.status as LabTestStatus);
        
        return (
          <div key={step.status} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              {/* Line before */}
              {index > 0 && (
                <div 
                  className={`h-0.5 flex-1 ${isPast ? 'bg-blue-500' : 'bg-gray-200'}`} 
                />
              )}
              
              {/* Circle node */}
              <div 
                className={`
                  relative flex items-center justify-center w-8 h-8 rounded-full 
                  ${isCurrent ? 'bg-blue-500 text-white' : 
                    isPast ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-400'}
                `}
              >
                <Icon className="h-4 w-4" />
              </div>
              
              {/* Line after */}
              {index < steps.length - 1 && (
                <div 
                  className={`h-0.5 flex-1 ${isPast ? 'bg-blue-500' : 'bg-gray-200'}`} 
                />
              )}
            </div>
            
            {/* Step label and representative */}
            <div className="mt-1 text-center">
              <div className={`text-xs font-medium ${isCurrent ? 'text-blue-700' : isPast ? 'text-gray-700' : 'text-gray-400'}`}>
                {step.label}
              </div>
              
              {/* Show representative name if available */}
              {representative && (isPast || isCurrent) && (
                <div className="text-[10px] text-gray-500 mt-0.5 max-w-20 truncate">
                  {representative}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WorkflowProgress;
