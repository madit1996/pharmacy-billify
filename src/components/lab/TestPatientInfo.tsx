
import { LabTest } from "@/types/lab-tests";

interface TestPatientInfoProps {
  test: LabTest;
}

const TestPatientInfo = ({ test }: TestPatientInfoProps) => {
  return (
    <div className="bg-gray-50 rounded-md p-6 mb-6 border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium text-lg text-gray-900 mb-1">{test.patientName}</h3>
          <p className="text-sm text-gray-500">Patient ID: {test.patientId}</p>
          <p className="text-sm text-gray-500 mt-2">Ordered: {test.orderedDate.toLocaleDateString()}</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-700 mb-1">{test.testName}</h4>
          <p className="text-sm text-gray-500">Requested by: {test.doctorName}</p>
          <p className="text-sm text-gray-500 mt-2">Category: {test.category}</p>
        </div>
      </div>
    </div>
  );
};

export default TestPatientInfo;
