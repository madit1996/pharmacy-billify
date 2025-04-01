
import { LabTest } from "@/types/lab-tests";

interface TestPatientInfoProps {
  test: LabTest;
}

const TestPatientInfo = ({ test }: TestPatientInfoProps) => {
  return (
    <div className="p-4 bg-gray-50 rounded-md mb-4">
      <h3 className="font-medium text-gray-700 mb-1">Patient: {test.patientName}</h3>
      <p className="text-sm text-gray-500">Test: {test.testName}</p>
    </div>
  );
};

export default TestPatientInfo;
