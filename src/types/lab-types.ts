
// Lab billing types
export type LabBillItem = {
  id: string;
  testName: string;
  price: number;
  quantity: number;
  discount: number;
  category: 'pathology' | 'radiology' | 'other';
};

export type LabCustomer = {
  id: string;
  name: string;
  mobile: string;
  address: string;
  email?: string;
};

// Lab test option type
export interface LabTestOption {
  id: string;
  testName: string;
  price: number;
  category: 'pathology' | 'radiology' | 'other';
}
