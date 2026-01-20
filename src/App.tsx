import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import UmpanBalik from "./pages/UmpanBalik";
import KamusKarierMasterData from "./pages/KamusKarierMasterData";
import ProfesiDetail from "./pages/ProfesiDetail";
import ProfesiEdit from "./pages/ProfesiEdit";
import MembershipFiturHakAkses from "./pages/MembershipFiturHakAkses";
import SistemTokenIkhtisar from "./pages/SistemTokenIkhtisar";
import SistemTokenPengadaan from "./pages/SistemTokenPengadaan";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/kenali-diri/umpan-balik" element={<UmpanBalik />} />
          <Route path="/kamus-karier/master-data" element={<KamusKarierMasterData />} />
          <Route path="/kamus-karier/master-data/profesi/:id" element={<ProfesiDetail />} />
          <Route path="/kamus-karier/master-data/profesi/:id/edit" element={<ProfesiEdit />} />
          <Route path="/membership/fitur-hak-akses" element={<MembershipFiturHakAkses />} />
          <Route path="/sistem-token/ikhtisar" element={<SistemTokenIkhtisar />} />
          <Route path="/sistem-token/pengadaan" element={<SistemTokenPengadaan />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
