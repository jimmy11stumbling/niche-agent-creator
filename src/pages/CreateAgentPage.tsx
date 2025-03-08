
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgentCreator from "@/components/AgentCreator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, DatabaseIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CreateAgentPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 mb-8">
          <Alert className="bg-primary/5 border-primary/20">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Note about model downloads</AlertTitle>
            <AlertDescription>
              Some models require a Hugging Face account and token for access. If you encounter download issues, you can use Demo Mode to test your agent with simulated responses.
            </AlertDescription>
          </Alert>
          
          <div className="mt-4 flex items-center justify-end space-x-2">
            <Link to="/dataset-management">
              <Button variant="outline" className="flex items-center gap-1">
                <DatabaseIcon className="h-4 w-4" />
                Dataset Management
              </Button>
            </Link>
            <Link to="/workflows">
              <Button variant="outline">
                Try Workflow Automation
              </Button>
            </Link>
          </div>
        </div>
        <AgentCreator />
      </main>
      <Footer />
    </div>
  );
};

export default CreateAgentPage;
