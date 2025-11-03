import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import LogisticLayout from "./pages/logistic/LogisticLayout";
import Dashboard from "./pages/logistic/Dashboard";
import Inventory from "./pages/logistic/Inventory";
import ProsesOrder from "./pages/logistic/ProsesOrder";
import ProsesReturn from "./pages/logistic/ProsesReturn";
import AccountLayout from "./pages/account/AccountLayout";
import PengesahanResit from "./pages/account/PengesahanResit";
import ApprovedResit from "./pages/account/ApprovedResit";
import TotalSales from "./pages/account/TotalSales";
import SalesLayout from "./pages/sales/SalesLayout";
import SalesDashboard from "./pages/sales/Dashboard";
import SubmitOrder from "./pages/sales/SubmitOrder";
import SubmitProspect from "./pages/sales/SubmitProspect";
import Payment from "./pages/sales/Payment";
import SalesReturn from "./pages/sales/Return";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<Index />} />
          <Route path="/logistic" element={<LogisticLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="proses-order" element={<ProsesOrder />} />
            <Route path="proses-return" element={<ProsesReturn />} />
          </Route>
          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<Navigate to="/account/pengesahan-resit" replace />} />
            <Route path="pengesahan-resit" element={<PengesahanResit />} />
            <Route path="approved-resit" element={<ApprovedResit />} />
            <Route path="total-sales" element={<TotalSales />} />
          </Route>
          <Route path="/sales" element={<SalesLayout />}>
            <Route index element={<Navigate to="/sales/dashboard" replace />} />
            <Route path="dashboard" element={<SalesDashboard />} />
            <Route path="submit-order" element={<SubmitOrder />} />
            <Route path="submit-prospect" element={<SubmitProspect />} />
            <Route path="payment" element={<Payment />} />
            <Route path="return" element={<SalesReturn />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
