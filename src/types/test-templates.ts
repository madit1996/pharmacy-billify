
// Define test field structure
export interface TestField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  unit?: string;
  options?: string[];
  step?: string;
  reference?: string;
}

// Define test section structure
export interface TestSection {
  name: string;
  displayName: string;
  fields: TestField[];
}

// Define test template structure
export interface TestTemplate {
  name: string;
  displayName: string;
  fields: TestField[];
  sections?: TestSection[];
}

// Test templates
const testTemplates: Record<string, TestTemplate> = {
  "Complete Blood Count": {
    name: "cbc",
    displayName: "Complete Blood Count",
    fields: [
      { 
        name: "wbc", 
        label: "WBC", 
        type: "number", 
        required: true, 
        unit: "× 10⁹/L",
        reference: "4.5-11.0"
      },
      { 
        name: "rbc", 
        label: "RBC", 
        type: "number", 
        required: true, 
        unit: "× 10¹²/L",
        reference: "4.5-5.5 (M), 4.0-5.0 (F)"
      },
      { 
        name: "hgb", 
        label: "Hemoglobin", 
        type: "number", 
        required: true, 
        unit: "g/dL",
        reference: "13.5-17.5 (M), 12.0-16.0 (F)"
      },
      { 
        name: "hct", 
        label: "Hematocrit", 
        type: "number", 
        required: true, 
        unit: "%",
        reference: "41-50 (M), 36-44 (F)"
      }
    ],
    sections: [
      {
        name: "differential",
        displayName: "Differential Count",
        fields: [
          { 
            name: "neutrophils", 
            label: "Neutrophils", 
            type: "number", 
            required: true, 
            unit: "%",
            reference: "40-70"
          },
          { 
            name: "lymphocytes", 
            label: "Lymphocytes", 
            type: "number", 
            required: true, 
            unit: "%",
            reference: "20-40"
          },
          { 
            name: "monocytes", 
            label: "Monocytes", 
            type: "number", 
            required: true, 
            unit: "%",
            reference: "2-8"
          },
          { 
            name: "eosinophils", 
            label: "Eosinophils", 
            type: "number", 
            required: true, 
            unit: "%",
            reference: "1-4"
          }
        ]
      },
      {
        name: "indices",
        displayName: "RBC Indices",
        fields: [
          { 
            name: "mcv", 
            label: "MCV", 
            type: "number", 
            required: true, 
            unit: "fL",
            reference: "80-96"
          },
          { 
            name: "mch", 
            label: "MCH", 
            type: "number", 
            required: true, 
            unit: "pg",
            reference: "27-33"
          },
          { 
            name: "mchc", 
            label: "MCHC", 
            type: "number", 
            required: true, 
            unit: "g/dL",
            reference: "33-36"
          }
        ]
      }
    ]
  },
  "Lipid Profile": {
    name: "lipid",
    displayName: "Lipid Profile",
    fields: [
      { 
        name: "totalCholesterol", 
        label: "Total Cholesterol", 
        type: "number", 
        required: true, 
        unit: "mg/dL",
        reference: "<200"
      },
      { 
        name: "hdl", 
        label: "HDL Cholesterol", 
        type: "number", 
        required: true, 
        unit: "mg/dL",
        reference: ">40 (M), >50 (F)"
      },
      { 
        name: "ldl", 
        label: "LDL Cholesterol", 
        type: "number", 
        required: true, 
        unit: "mg/dL",
        reference: "<130"
      },
      { 
        name: "triglycerides", 
        label: "Triglycerides", 
        type: "number", 
        required: true, 
        unit: "mg/dL",
        reference: "<150"
      }
    ]
  },
  "Thyroid Function Test": {
    name: "thyroid",
    displayName: "Thyroid Function Test",
    fields: [
      { 
        name: "tsh", 
        label: "TSH", 
        type: "number", 
        required: true, 
        unit: "mIU/L",
        reference: "0.4-4.0"
      },
      { 
        name: "t4", 
        label: "T4", 
        type: "number", 
        required: true, 
        unit: "μg/dL",
        reference: "4.5-11.7"
      },
      { 
        name: "t3", 
        label: "T3", 
        type: "number", 
        required: true, 
        unit: "ng/dL",
        reference: "80-200"
      }
    ]
  },
  "Liver Function Test": {
    name: "liver",
    displayName: "Liver Function Test",
    fields: [
      { 
        name: "alt", 
        label: "ALT", 
        type: "number", 
        required: true, 
        unit: "U/L",
        reference: "7-56"
      },
      { 
        name: "ast", 
        label: "AST", 
        type: "number", 
        required: true, 
        unit: "U/L",
        reference: "8-48"
      },
      { 
        name: "albumin", 
        label: "Albumin", 
        type: "number", 
        required: true, 
        unit: "g/dL",
        reference: "3.5-5.5"
      },
      { 
        name: "totalBilirubin", 
        label: "Total Bilirubin", 
        type: "number", 
        required: true, 
        unit: "mg/dL",
        reference: "0.1-1.2"
      }
    ]
  },
  "Blood Glucose": {
    name: "glucose",
    displayName: "Blood Glucose Test",
    fields: [
      { 
        name: "fastingGlucose", 
        label: "Fasting Glucose", 
        type: "number", 
        required: true, 
        unit: "mg/dL",
        reference: "70-99"
      },
      { 
        name: "hba1c", 
        label: "HbA1c", 
        type: "number", 
        required: false, 
        unit: "%",
        reference: "<5.7"
      },
      {
        name: "notes",
        label: "Notes",
        type: "textarea",
        required: false,
        placeholder: "Enter any additional information here"
      }
    ]
  },
  "X-Ray Chest": {
    name: "xray_chest",
    displayName: "Chest X-Ray",
    fields: [
      {
        name: "findings",
        label: "Findings",
        type: "textarea",
        required: true
      },
      {
        name: "impression",
        label: "Impression",
        type: "textarea",
        required: true
      },
      {
        name: "comparison",
        label: "Comparison",
        type: "select",
        required: false,
        options: ["No prior studies", "Improved since prior", "Unchanged from prior", "Worsened since prior"]
      }
    ]
  },
  "MRI Brain": {
    name: "mri_brain",
    displayName: "MRI Brain",
    fields: [
      {
        name: "findings",
        label: "Findings",
        type: "textarea",
        required: true
      },
      {
        name: "impression",
        label: "Impression",
        type: "textarea",
        required: true
      },
      {
        name: "contrast",
        label: "Contrast",
        type: "select",
        required: true,
        options: ["With contrast", "Without contrast"]
      }
    ]
  },
  // Default template for other tests
  "default": {
    name: "default",
    displayName: "Test Results",
    fields: [
      {
        name: "findings",
        label: "Findings",
        type: "textarea",
        required: true
      },
      {
        name: "conclusion",
        label: "Conclusion",
        type: "textarea",
        required: true
      }
    ]
  }
};

export const getTestTemplate = (testName: string): TestTemplate => {
  return testTemplates[testName] || testTemplates.default;
};

export default testTemplates;
