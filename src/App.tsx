
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import CreateAgentPage from "./pages/CreateAgentPage";
import DeploymentPage from "./pages/DeploymentPage";
import TemplatesPage from "./pages/TemplatesPage";
import WorkflowDesignerPage from "./pages/WorkflowDesignerPage";
import WorkflowDashboardPage from "./pages/WorkflowDashboardPage";
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
          <Route path="/create" element={<CreateAgentPage />} />
          <Route path="/deploy/:agentId" element={<DeploymentPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/workflows" element={<WorkflowDashboardPage />} />
          <Route path="/workflows/designer" element={<WorkflowDesignerPage />} />
          <Route path="/workflows/designer/:workflowId" element={<WorkflowDesignerPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
