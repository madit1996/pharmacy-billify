
import { LabTest } from "@/types/lab-tests";
import LabMetricsPanel from "./LabMetricsPanel";

interface LabAnalyticsTabProps {
  pendingTests: LabTest[];
  completedTests: LabTest[];
}

const LabAnalyticsTab = ({ pendingTests, completedTests }: LabAnalyticsTabProps) => {
  return (
    <div>
      <LabMetricsPanel 
        pendingTests={pendingTests}
        completedTests={completedTests}
      />
    </div>
  );
};

export default LabAnalyticsTab;
