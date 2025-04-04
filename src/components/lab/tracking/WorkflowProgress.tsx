
import { LabTest } from "@/types/lab-tests";
import { Activity, Calendar, CheckCircle, FileText, Loader2 } from "lucide-react";

interface WorkflowProgressProps {
  test: LabTest;
}

const WorkflowProgress = ({ test }: WorkflowProgressProps) => {
  const getWorkflowSteps = () => {
    return [
      { status: 'pending', label: 'Ordered', icon: Calendar },
      { status: 'sampling', label: 'Sample Collection', icon: FileText },
      { status: 'processing', label: 'Processing', icon: Loader2 },
      { status: 'reporting', label: 'Reporting', icon: Activity },
      { status: 'completed', label: 'Completed', icon: CheckCircle },
    ];
  };
  
  const getCurrentStepIndex = (): number => {
    const statuses = ['pending', 'sampling', 'processing', 'reporting', 'completed'];
    return statuses.indexOf(test.status);
  };

  const steps = getWorkflowSteps();
  const currentIndex = getCurrentStepIndex();
  
  return (
    <div className="relative">
      <div className="flex justify-between mb-2">
        {steps.map((step, idx) => {
          const isComplete = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          
          return (
            <div 
              key={step.status} 
              className={`flex flex-col items-center ${
                isComplete ? 'text-blue-600' : 'text-gray-400'
              }`}
              style={{ width: `${100 / steps.length}%` }}
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
            (currentIndex / (steps.length - 1)) * 100
          }% - ${currentIndex > 0 ? 
            (currentIndex / (steps.length - 1)) * 16 : 0}px)`
        }}
      />
    </div>
  );
};

export default WorkflowProgress;
