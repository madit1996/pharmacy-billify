
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import PharmacyPage from "./pages/PharmacyPage";
import PatientsPage from "./pages/PatientsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import LabTestsPage from "./pages/LabTestsPage";
import AvailabilityPage from "./pages/AvailabilityPage";
import HumanResourcePage from "./pages/HumanResourcePage";
import FrontDeskPage from "./pages/FrontDeskPage";
import BedManagementPage from "./pages/BedManagementPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="lab-tests" element={<LabTestsPage />} />
            <Route path="availability" element={<AvailabilityPage />} />
            <Route path="human-resource" element={<HumanResourcePage />} />
            <Route path="front-desk" element={<FrontDeskPage />} />
            <Route path="bed-management" element={<BedManagementPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/pharmacy" element={<PharmacyPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
