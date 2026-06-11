import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { FarmerProvider } from "@/contexts/FarmerContext";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import SellAdvisor from "@/pages/SellAdvisor";
import IncomeSimulator from "@/pages/IncomeSimulator";
import DiseaseDetector from "@/pages/DiseaseDetector";
import CropRanker from "@/pages/CropRanker";
import WaterStress from "@/pages/WaterStress";
import FertilizerOptimizer from "@/pages/FertilizerOptimizer";
import MiddlemanMap from "@/pages/MiddlemanMap";
import SchemesMatcher from "@/pages/SchemesMatcher";
import CropCalendar from "@/pages/CropCalendar";
import AlertBot from "@/pages/AlertBot";
import Landing from "@/pages/Landing";
import FarmerScore from "@/pages/FarmerScore";
import DataSources from "./DataSources";
import NotFound from "./NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <FarmerProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/sell-advisor" element={<SellAdvisor />} />
                <Route path="/income-simulator" element={<IncomeSimulator />} />
                <Route path="/disease-detector" element={<DiseaseDetector />} />
                <Route path="/crop-ranker" element={<CropRanker />} />
                <Route path="/water-stress" element={<WaterStress />} />
                <Route path="/fertilizer" element={<FertilizerOptimizer />} />
                <Route path="/direct-buyers" element={<MiddlemanMap />} />
                <Route path="/schemes" element={<SchemesMatcher />} />
                <Route path="/crop-calendar" element={<CropCalendar />} />
                <Route path="/alerts" element={<AlertBot />} />
                <Route path="/farmer-score" element={<FarmerScore />} />
                <Route path="/data-sources" element={<DataSources />} />
                <Route path="/about" element={<Landing />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </FarmerProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
