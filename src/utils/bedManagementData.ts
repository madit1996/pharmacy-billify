
// Initial data for bed management
export const initialWards = [
  {
    id: 1,
    name: "ICU",
    type: "Critical Care",
    totalBeds: 10,
    availableBeds: 3,
    beds: Array(10).fill(null).map((_, i) => ({
      id: `ICU-${i+1}`,
      status: Math.random() > 0.3 ? "occupied" : "available",
      patientId: Math.random() > 0.3 ? Math.floor(Math.random() * 1000) : null,
      patientName: Math.random() > 0.3 ? ["Budi Santoso", "Sri Wulandari", "Ahmad Hidayat", "Dewi Sartika", "Joko Widodo"][Math.floor(Math.random() * 5)] : null,
      admissionDate: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000) : null,
      expectedDischarge: Math.random() > 0.3 ? new Date(Date.now() + Math.random() * 5 * 24 * 60 * 60 * 1000) : null,
    }))
  },
  {
    id: 2,
    name: "General Ward",
    type: "Standard Care",
    totalBeds: 30,
    availableBeds: 12,
    beds: Array(30).fill(null).map((_, i) => ({
      id: `GW-${i+1}`,
      status: Math.random() > 0.4 ? "occupied" : "available",
      patientId: Math.random() > 0.4 ? Math.floor(Math.random() * 1000) : null,
      patientName: Math.random() > 0.4 ? ["Siti Rahayu", "Bambang Suprapto", "Rina Wati", "Hendra Setiawan", "Lina Marlina"][Math.floor(Math.random() * 5)] : null,
      admissionDate: Math.random() > 0.4 ? new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000) : null,
      expectedDischarge: Math.random() > 0.4 ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
    }))
  },
  {
    id: 3,
    name: "Pediatric Ward",
    type: "Specialized Care",
    totalBeds: 15,
    availableBeds: 5,
    beds: Array(15).fill(null).map((_, i) => ({
      id: `PED-${i+1}`,
      status: Math.random() > 0.35 ? "occupied" : "available",
      patientId: Math.random() > 0.35 ? Math.floor(Math.random() * 1000) : null,
      patientName: Math.random() > 0.35 ? ["Dimas Putra", "Nadia Putri", "Rizki Rahman", "Maya Sari", "Andi Wijaya"][Math.floor(Math.random() * 5)] : null,
      admissionDate: Math.random() > 0.35 ? new Date(Date.now() - Math.random() * 8 * 24 * 60 * 60 * 1000) : null,
      expectedDischarge: Math.random() > 0.35 ? new Date(Date.now() + Math.random() * 6 * 24 * 60 * 60 * 1000) : null,
    }))
  },
  {
    id: 4,
    name: "Maternity Ward",
    type: "Specialized Care",
    totalBeds: 12,
    availableBeds: 3,
    beds: Array(12).fill(null).map((_, i) => ({
      id: `MAT-${i+1}`,
      status: Math.random() > 0.25 ? "occupied" : "available",
      patientId: Math.random() > 0.25 ? Math.floor(Math.random() * 1000) : null,
      patientName: Math.random() > 0.25 ? ["Ratna Dewi", "Susi Susanti", "Tuti Winarti", "Ani Yudhoyono", "Nina Setiawati"][Math.floor(Math.random() * 5)] : null,
      admissionDate: Math.random() > 0.25 ? new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000) : null,
      expectedDischarge: Math.random() > 0.25 ? new Date(Date.now() + Math.random() * 4 * 24 * 60 * 60 * 1000) : null,
    }))
  }
];

// Sample patients for bed assignment dialog
export const samplePatients = [
  { id: 1001, name: "Anwar Ibrahim", gender: "Male", age: 42, diagnosis: "Pneumonia" },
  { id: 1002, name: "Siti Nurhaliza", gender: "Female", age: 35, diagnosis: "Post-surgery recovery" },
  { id: 1003, name: "Taufik Hidayat", gender: "Male", age: 28, diagnosis: "Fractured leg" },
  { id: 1004, name: "Raisa Andriana", gender: "Female", age: 32, diagnosis: "Childbirth" },
  { id: 1005, name: "Ridwan Kamil", gender: "Male", age: 45, diagnosis: "Cardiac monitoring" },
];

// Occupancy data for charts
export const occupancyData = [
  { name: "ICU", available: 3, occupied: 7 },
  { name: "General Ward", available: 12, occupied: 18 },
  { name: "Pediatric Ward", available: 5, occupied: 10 },
  { name: "Maternity Ward", available: 3, occupied: 9 },
];

export const bedTurnoverData = [
  { name: "ICU", turnover: 3.2 },
  { name: "General Ward", turnover: 5.8 },
  { name: "Pediatric Ward", turnover: 4.5 },
  { name: "Maternity Ward", turnover: 7.2 },
];

export const averageStayData = [
  { name: "ICU", days: 4.5 },
  { name: "General Ward", days: 3.2 },
  { name: "Pediatric Ward", days: 2.8 },
  { name: "Maternity Ward", days: 2.3 },
];
