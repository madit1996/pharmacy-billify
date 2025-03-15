
import { useLabContext } from "@/contexts/LabContext";
import LabMetricsPanel from "./LabMetricsPanel";

const LabAnalyticsTab = () => {
  const { pendingTests, completedTests } = useLabContext();
  
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
