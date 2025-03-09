
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Index from "./pages/Index";
import CreateAgentPage from "./pages/CreateAgentPage";
import TemplatesPage from "./pages/TemplatesPage";
import DeploymentPage from "./pages/DeploymentPage";
import WorkflowDesignerPage from "./pages/WorkflowDesignerPage";
import DataAnalysisPage from "./pages/DataAnalysisPage";
import DatasetManagementPage from "./pages/DatasetManagementPage";
import WorkflowDashboardPage from "./pages/WorkflowDashboardPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import PricingPage from "./pages/PricingPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import DocumentationPage from "./pages/DocumentationPage";
import TutorialsPage from "./pages/TutorialsPage";
import ApiReferencePage from "./pages/ApiReferencePage";
import BlogPage from "./pages/BlogPage";
import MVPPage from "./pages/MVP";
import NotFound from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";

// Create a new query client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/create-agent" element={<CreateAgentPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/deploy/:agentId" element={<DeploymentPage />} />
          <Route path="/workflow-designer" element={<WorkflowDesignerPage />} />
          <Route path="/data-analysis" element={<DataAnalysisPage />} />
          <Route path="/dataset-management" element={<DatasetManagementPage />} />
          <Route path="/workflows" element={<WorkflowDashboardPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/docs" element={<DocumentationPage />} />
          <Route path="/tutorials" element={<TutorialsPage />} />
          <Route path="/api" element={<ApiReferencePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/mvp" element={<MVPPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
