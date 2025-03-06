
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { lazy, Suspense } from "react";

// Import pages
import MVPPage from "./pages/MVP";
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import PricingPage from "./pages/PricingPage";
import DocumentationPage from "./pages/DocumentationPage";
import CreateAgentPage from "./pages/CreateAgentPage";
import NotFound from "./pages/NotFound";
import TemplatesPage from "./pages/TemplatesPage";
import ApiReferencePage from "./pages/ApiReferencePage";
import TutorialsPage from "./pages/TutorialsPage";
import BlogPage from "./pages/BlogPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import WorkflowDashboardPage from "./pages/WorkflowDashboardPage";
import WorkflowDesignerPage from "./pages/WorkflowDesignerPage";
import DeploymentPage from "./pages/DeploymentPage";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<MVPPage />} />
        <Route path="/home" element={<Index />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/docs" element={<DocumentationPage />} />
        <Route path="/api" element={<ApiReferencePage />} />
        <Route path="/tutorials" element={<TutorialsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/create-agent" element={<CreateAgentPage />} />
        <Route path="/workflows" element={<WorkflowDashboardPage />} />
        <Route path="/workflow-designer" element={<WorkflowDesignerPage />} />
        <Route path="/workflow-designer/:workflowId" element={<WorkflowDesignerPage />} />
        <Route path="/deploy/:agentId" element={<DeploymentPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
