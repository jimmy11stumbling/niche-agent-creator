
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WorkflowDesigner from "@/components/WorkflowDesigner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const WorkflowDesignerPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 mb-8">
          <Alert className="bg-primary/5 border-primary/20">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Workflow Automation</AlertTitle>
            <AlertDescription>
              Create and manage automated workflows using our visual designer. Connect tasks, define conditions, and automate your business processes.
            </AlertDescription>
          </Alert>
        </div>
        <WorkflowDesigner />
      </main>
      <Footer />
    </div>
  );
};

export default WorkflowDesignerPage;
