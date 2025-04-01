
// Define types for test fields and templates
export interface TestFieldOption {
  value: string;
  label: string;
}

export interface TestField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  unit?: string;
  placeholder?: string;
  step?: string;
  reference?: string;
  options?: TestFieldOption[];
}

export interface TestSection {
  name: string;
  label: string;
  fields: TestField[];
}

export interface TestTemplate {
  name: string;
  displayName: string;
  fields: TestField[];
  sections?: TestSection[];
}

// Test template definitions
export const testTemplates: Record<string, TestTemplate> = {
  completeBloodCount: {
    name: "cbc",
    displayName: "Complete Blood Count",
    fields: [
      { name: "wbc", label: "White Blood Cell Count", type: "number", unit: "x10^9/L", required: true, reference: "4.0-11.0" },
      { name: "rbc", label: "Red Blood Cell Count", type: "number", unit: "x10^12/L", required: true, reference: "4.5-6.0 (men), 4.0-5.5 (women)" },
      { name: "hemoglobin", label: "Hemoglobin", type: "number", unit: "g/dL", required: true, reference: "13.5-17.5 (men), 12.0-16.0 (women)" },
      { name: "hematocrit", label: "Hematocrit", type: "number", unit: "%", required: true, reference: "40-52 (men), 36-48 (women)" },
      { name: "platelets", label: "Platelet Count", type: "number", unit: "x10^9/L", required: true, reference: "150-450" }
    ],
    sections: [
      {
        name: "differential",
        label: "Differential Count",
        fields: [
          { name: "neutrophils", label: "Neutrophils", type: "number", unit: "%", required: true, reference: "40-75" },
          { name: "lymphocytes", label: "Lymphocytes", type: "number", unit: "%", required: true, reference: "20-45" },
          { name: "monocytes", label: "Monocytes", type: "number", unit: "%", required: true, reference: "2-10" },
          { name: "eosinophils", label: "Eosinophils", type: "number", unit: "%", required: true, reference: "1-6" },
          { name: "basophils", label: "Basophils", type: "number", unit: "%", required: true, reference: "0-1" }
        ]
      }
    ]
  },
  lipidProfile: {
    name: "lipid",
    displayName: "Lipid Profile",
    fields: [
      { name: "total_cholesterol", label: "Total Cholesterol", type: "number", unit: "mg/dL", required: true, reference: "<200" },
      { name: "triglycerides", label: "Triglycerides", type: "number", unit: "mg/dL", required: true, reference: "<150" },
      { name: "hdl", label: "HDL Cholesterol", type: "number", unit: "mg/dL", required: true, reference: ">40 (men), >50 (women)" },
      { name: "ldl", label: "LDL Cholesterol", type: "number", unit: "mg/dL", required: true, reference: "<100" },
      { name: "risk_ratio", label: "Total Cholesterol/HDL Ratio", type: "number", required: false, reference: "<5.0" }
    ]
  },
  thyroidFunction: {
    name: "thyroid",
    displayName: "Thyroid Function Test",
    fields: [
      { name: "tsh", label: "Thyroid Stimulating Hormone (TSH)", type: "number", unit: "mIU/L", required: true, reference: "0.4-4.0" },
      { name: "t4", label: "Thyroxine (T4)", type: "number", unit: "µg/dL", required: true, reference: "4.5-11.2" },
      { name: "t3", label: "Triiodothyronine (T3)", type: "number", unit: "ng/dL", required: true, reference: "80-200" },
      { name: "ft4", label: "Free T4", type: "number", unit: "ng/dL", required: false, reference: "0.8-1.8" }
    ]
  },
  liverFunction: {
    name: "liver",
    displayName: "Liver Function Test",
    fields: [
      { name: "alt", label: "Alanine Transaminase (ALT)", type: "number", unit: "U/L", required: true, reference: "7-56" },
      { name: "ast", label: "Aspartate Transaminase (AST)", type: "number", unit: "U/L", required: true, reference: "5-40" },
      { name: "alp", label: "Alkaline Phosphatase (ALP)", type: "number", unit: "U/L", required: true, reference: "44-147" },
      { name: "ggt", label: "Gamma-Glutamyl Transferase (GGT)", type: "number", unit: "U/L", required: true, reference: "<50 (men), <32 (women)" },
      { name: "bilirubin_total", label: "Total Bilirubin", type: "number", unit: "mg/dL", required: true, reference: "0.1-1.2" },
      { name: "bilirubin_direct", label: "Direct Bilirubin", type: "number", unit: "mg/dL", required: false, reference: "<0.3" },
      { name: "albumin", label: "Albumin", type: "number", unit: "g/dL", required: true, reference: "3.5-5.0" }
    ]
  },
  generic: {
    name: "generic",
    displayName: "Laboratory Test",
    fields: [
      { name: "result", label: "Test Result", type: "text", required: true, placeholder: "Enter test result" },
      { name: "comments", label: "Comments", type: "text", required: false, placeholder: "Add any additional comments" }
    ]
  }
};

// Helper function to get the template for a specific test type
export function getTestTemplate(testName: string): TestTemplate {
  const normalizedTestName = testName.toLowerCase();
  
  if (normalizedTestName.includes("blood") && normalizedTestName.includes("count")) {
    return testTemplates.completeBloodCount;
  } else if (normalizedTestName.includes("lipid")) {
    return testTemplates.lipidProfile;
  } else if (normalizedTestName.includes("thyroid")) {
    return testTemplates.thyroidFunction;
  } else if (normalizedTestName.includes("liver")) {
    return testTemplates.liverFunction;
  } else {
    return testTemplates.generic;
  }
}
