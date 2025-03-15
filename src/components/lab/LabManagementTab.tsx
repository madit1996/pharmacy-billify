
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PendingTestsList from "./PendingTestsList";
import CompletedTestsList from "./CompletedTestsList";
import UploadTestResultForm from "./UploadTestResultForm";
import { useLabContext } from "@/contexts/LabContext";

const LabManagementTab = () => {
  const {
    pendingTests,
    completedTests,
    selectedTest,
    handleSelectTest,
    handleUploadResult
  } = useLabContext();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="pending">Pending Tests ({pendingTests.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed Tests ({completedTests.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Tests</CardTitle>
                <CardDescription>Tests waiting to be processed</CardDescription>
              </CardHeader>
              <CardContent>
                <PendingTestsList 
                  tests={pendingTests}
                  onSelectTest={handleSelectTest}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Tests</CardTitle>
                <CardDescription>Tests with uploaded results</CardDescription>
              </CardHeader>
              <CardContent>
                <CompletedTestsList tests={completedTests} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div>
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Upload Test Results</CardTitle>
            <CardDescription>
              Select a test from the pending list and upload its results
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedTest ? (
              <UploadTestResultForm 
                test={selectedTest}
                onUpload={handleUploadResult}
                onCancel={() => handleSelectTest(null)}
              />
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
                <p>Select a test from the pending list to upload results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LabManagementTab;
