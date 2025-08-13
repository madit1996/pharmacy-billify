
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { UserProvider } from "@/contexts/UserContext";
import { AiCreditsProvider } from "@/contexts/AiCreditsContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import PatientsPage from "./pages/PatientsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import PatientEditPage from "./pages/PatientEditPage";
import PharmacyPage from "./pages/PharmacyPage";
import ReferralPage from "./pages/ReferralPage";
import LabTestsPage from "./pages/LabTestsPage";
import BloodBankPage from "./pages/BloodBankPage";
import BedManagementPage from "./pages/BedManagementPage";
import HumanResourcePage from "./pages/HumanResourcePage";
import MaterialStorePage from "./pages/MaterialStorePage";
import AccountsFinancePage from "./pages/AccountsFinancePage";
import BillingHistoryPage from "./pages/BillingHistoryPage";
import AmbulanceDispatchPage from "./pages/AmbulanceDispatchPage";
import LegalCertificatesPage from "./pages/LegalCertificatesPage";
import AvailabilityPage from "./pages/AvailabilityPage";
import FrontDeskPage from "./pages/FrontDeskPage";
import ICUPage from "./pages/ICUPage";
import IPDPage from "./pages/IPDPage";
import OTPage from "./pages/OTPage";
import AiCreditsPage from "./pages/AiCreditsPage";
import OrganizationCreditsPage from "./pages/OrganizationCreditsPage";
import NotFound from "./pages/NotFound";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <AiCreditsProvider>
          <Router>
            <div className="App w-full h-full">
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="patients" element={<PatientsPage />} />
                  <Route path="patients/:patientId/edit" element={<PatientEditPage />} />
                  <Route path="appointments" element={<AppointmentsPage />} />
                  <Route path="referrals" element={<ReferralPage />} />
                  <Route path="pharmacy" element={<PharmacyPage />} />
                  <Route path="lab-tests" element={<LabTestsPage />} />
                  <Route path="blood-bank" element={<BloodBankPage />} />
                  <Route path="bed-management" element={<BedManagementPage />} />
                  <Route path="human-resources" element={<HumanResourcePage />} />
                  <Route path="material-store" element={<MaterialStorePage />} />
                  <Route path="accounts-finance" element={<AccountsFinancePage />} />
                  <Route path="billing-history" element={<BillingHistoryPage />} />
                  <Route path="ambulance-dispatch" element={<AmbulanceDispatchPage />} />
                  <Route path="legal-certificates" element={<LegalCertificatesPage />} />
                  <Route path="availability" element={<AvailabilityPage />} />
                  <Route path="front-desk" element={<FrontDeskPage />} />
                  <Route path="icu" element={<ICUPage />} />
                  <Route path="ipd" element={<IPDPage />} />
                  <Route path="ot" element={<OTPage />} />
                  <Route path="ai-credits" element={<AiCreditsPage />} />
                  <Route path="ai-credits/organization" element={<OrganizationCreditsPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </AiCreditsProvider>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
