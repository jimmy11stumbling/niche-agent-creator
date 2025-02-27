
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AgentCreator from "@/components/AgentCreator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

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
        </div>
        <AgentCreator />
      </main>
      <Footer />
    </div>
  );
};

export default CreateAgentPage;
