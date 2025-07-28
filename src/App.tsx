
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import PatientsPage from "./pages/PatientsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import PatientEditPage from "./pages/PatientEditPage";
import PharmacyPage from "./pages/PharmacyPage";
import ReferralPage from "./pages/ReferralPage";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="patients" element={<PatientsPage />} />
              <Route path="patients/:patientId/edit" element={<PatientEditPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="referrals" element={<ReferralPage />} />
            </Route>
            <Route path="/pharmacy" element={<PharmacyPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
