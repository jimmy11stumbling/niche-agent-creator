
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WorkflowDashboard from "@/components/WorkflowDashboard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const WorkflowDashboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 mb-8">
          <Alert className="bg-primary/5 border-primary/20">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Workflow Dashboard</AlertTitle>
            <AlertDescription>
              Monitor and manage your workflow executions. View status, logs, and performance metrics for all your automated processes.
            </AlertDescription>
          </Alert>
        </div>
        <WorkflowDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default WorkflowDashboardPage;
