
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import PendingTestsList from "./PendingTestsList";
import CompletedTestsList from "./CompletedTestsList";
import { LabTest } from "@/types/lab-tests";

interface LabTestTabsProps {
  pendingTests: LabTest[];
  completedTests: LabTest[];
  activeTab: "pending" | "completed";
  setActiveTab: (tab: "pending" | "completed") => void;
  onSelectTest: (test: LabTest) => void;
}

const LabTestTabs = ({
  pendingTests,
  completedTests,
  activeTab,
  setActiveTab,
  onSelectTest
}: LabTestTabsProps) => {
  return (
    <Tabs defaultValue={activeTab} value={activeTab} onValueChange={(v) => setActiveTab(v as "pending" | "completed")}>
      <TabsList className="mb-4">
        <TabsTrigger value="pending" className="flex items-center gap-2">
          Pending
          <Badge variant="secondary" className="rounded-full px-2">
            {pendingTests.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="completed" className="flex items-center gap-2">
          Completed
          <Badge variant="secondary" className="rounded-full px-2">
            {completedTests.length}
          </Badge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="pending">
        <PendingTestsList
          tests={pendingTests}
          onSelectTest={onSelectTest}
        />
      </TabsContent>
      <TabsContent value="completed">
        <CompletedTestsList tests={completedTests} />
      </TabsContent>
    </Tabs>
  );
};

export default LabTestTabs;
