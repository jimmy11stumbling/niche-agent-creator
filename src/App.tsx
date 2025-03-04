
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
import DocumentationPage from "./pages/DocumentationPage";
import TutorialsPage from "./pages/TutorialsPage";
import ApiReferencePage from "./pages/ApiReferencePage";
import BlogPage from "./pages/BlogPage";
import AboutPage from "./pages/AboutPage";
import PricingPage from "./pages/PricingPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
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
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route path="/tutorials" element={<TutorialsPage />} />
          <Route path="/api-reference" element={<ApiReferencePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
