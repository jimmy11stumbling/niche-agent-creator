
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DeploymentWizard from "@/components/DeploymentWizard";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Rocket } from "lucide-react";

const DeploymentPage = () => {
  const { toast } = useToast();
  const { agentId } = useParams();
  const [agent, setAgent] = useState({
    id: agentId || "1",
    name: "Financial Advisor",
    niche: "finance",
    description: "Provides financial advice and guidance on investments, budgeting, and savings.",
    deploymentMethod: "web", 
  });

  useEffect(() => {
    // Simulate fetching agent data
    // In a real app, this would be a fetch call to your backend
    toast({
      title: "Ready to Deploy",
      description: `Configure deployment options for "${agent.name}"`,
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="mb-6">
            <Button variant="ghost" asChild className="mb-4">
              <Link to="/agents">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Agents
              </Link>
            </Button>
            
            <h1 className="text-3xl font-bold mb-2">Deploy Your Agent</h1>
            <p className="text-muted-foreground">
              Configure and deploy your AI agent to make it available to users
            </p>
          </div>
          
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Agent Details</CardTitle>
                <CardDescription>
                  Review your agent details before deployment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium">Name</h3>
                    <p className="text-sm text-muted-foreground">{agent.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Niche</h3>
                    <p className="text-sm text-muted-foreground">{agent.niche}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium">Description</h3>
                    <p className="text-sm text-muted-foreground">{agent.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <DeploymentWizard agent={agent} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DeploymentPage;
