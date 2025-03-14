
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PendingTestsList from "@/components/lab/PendingTestsList";
import CompletedTestsList from "@/components/lab/CompletedTestsList";
import UploadTestResultForm from "@/components/lab/UploadTestResultForm";
import { LabTest } from "@/types/lab-tests";

const LabTestsPage = () => {
  const [pendingTests, setPendingTests] = useState<LabTest[]>([
    { 
      id: "LT001", 
      patientName: "John Doe", 
      patientId: "P001", 
      testName: "Complete Blood Count", 
      status: "pending", 
      orderedDate: new Date(2023, 7, 15),
      doctorName: "Dr. Sarah Smith"
    },
    { 
      id: "LT002", 
      patientName: "Jane Smith", 
      patientId: "P002", 
      testName: "Lipid Profile", 
      status: "pending", 
      orderedDate: new Date(2023, 7, 16),
      doctorName: "Dr. Robert Johnson"
    },
    { 
      id: "LT003", 
      patientName: "Alex Brown", 
      patientId: "P003", 
      testName: "Thyroid Function Test", 
      status: "pending", 
      orderedDate: new Date(2023, 7, 16),
      doctorName: "Dr. Emily Williams"
    },
    { 
      id: "LT004", 
      patientName: "Maria Garcia", 
      patientId: "P004", 
      testName: "Blood Glucose", 
      status: "pending", 
      orderedDate: new Date(2023, 7, 17),
      doctorName: "Dr. Michael Davis"
    },
    { 
      id: "LT005", 
      patientName: "Robert Wilson", 
      patientId: "P005", 
      testName: "Liver Function Test", 
      status: "pending", 
      orderedDate: new Date(2023, 7, 17),
      doctorName: "Dr. Sarah Smith"
    }
  ]);

  const [completedTests, setCompletedTests] = useState<LabTest[]>([
    { 
      id: "LT006", 
      patientName: "David Lee", 
      patientId: "P006", 
      testName: "Complete Blood Count", 
      status: "completed", 
      orderedDate: new Date(2023, 7, 14),
      completedDate: new Date(2023, 7, 15),
      resultUrl: "https://example.com/results/LT006.pdf",
      doctorName: "Dr. Robert Johnson"
    },
    { 
      id: "LT007", 
      patientName: "Lucy Chen", 
      patientId: "P007", 
      testName: "Urine Analysis", 
      status: "completed", 
      orderedDate: new Date(2023, 7, 13),
      completedDate: new Date(2023, 7, 14),
      resultUrl: "https://example.com/results/LT007.pdf",
      doctorName: "Dr. Emily Williams"
    }
  ]);

  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);

  const handleSelectTest = (test: LabTest) => {
    setSelectedTest(test);
  };

  const handleUploadResult = (testId: string, resultFile: File) => {
    // In a real app, you would upload the file to a server
    // For now, we'll simulate this process

    // Find the test to update
    const testToUpdate = pendingTests.find(test => test.id === testId);
    
    if (!testToUpdate) return;
    
    // Create a fake URL for demo purposes
    const fakeResultUrl = `https://example.com/results/${testId}.pdf`;
    
    // Create updated test object
    const updatedTest: LabTest = {
      ...testToUpdate,
      status: "completed",
      completedDate: new Date(),
      resultUrl: fakeResultUrl
    };
    
    // Remove the test from pending tests
    const updatedPendingTests = pendingTests.filter(test => test.id !== testId);
    setPendingTests(updatedPendingTests);
    
    // Add to completed tests
    setCompletedTests([...completedTests, updatedTest]);
    
    // Reset selected test
    setSelectedTest(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Laboratory Test Management</h1>
      
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
        
        {/* Right Panel - Upload Test Results */}
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
                  onCancel={() => setSelectedTest(null)}
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
    </div>
  );
};

export default LabTestsPage;
