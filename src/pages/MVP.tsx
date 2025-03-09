
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Rocket, MessageSquare, Workflow, Database, Brain, FileCode } from "lucide-react";
import AgentChat from "@/components/agent/AgentChat";

const MVPPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Sample agent for demo
  const demoAgent = {
    name: "MVP Demo Assistant",
    description: "A demo assistant to showcase the core functionality of the application.",
    niche: "productivity",
    isModelDownloaded: true,
    useDemoMode: true
  };

  const handleCreateAgentClick = () => {
    navigate("/create-agent");
  };

  const handleTemplatesClick = () => {
    navigate("/templates");
  };

  const handleWorkflowsClick = () => {
    navigate("/workflows");
  };

  const handleFeatureClick = (feature: string) => {
    toast({
      title: "Feature Selected",
      description: `You're exploring the ${feature} feature.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">AgentCreator MVP</h1>
            <p className="text-xl text-muted-foreground mb-6">
              Create, customize, and deploy AI agents for any niche without coding
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" onClick={handleCreateAgentClick}>
                <Brain className="mr-2 h-4 w-4" />
                Create Your Agent
              </Button>
              <Button size="lg" variant="outline" onClick={handleTemplatesClick}>
                <FileCode className="mr-2 h-4 w-4" />
                Browse Templates
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="demo">Live Demo</TabsTrigger>
              <TabsTrigger value="features">Key Features</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>What is AgentCreator?</CardTitle>
                  <CardDescription>A platform for creating custom AI agents</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    AgentCreator is a no-code platform that allows anyone to create, customize, and deploy AI agents
                    tailored to specific niches. Whether you need a financial advisor, fitness coach, programming mentor,
                    or any other specialized assistant, our platform makes it easy to build and share your own AI agents.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="flex flex-col items-center p-4 bg-secondary/30 rounded-lg">
                      <Brain className="h-10 w-10 text-primary mb-2" />
                      <h3 className="text-lg font-medium">Customizable Agents</h3>
                      <p className="text-sm text-center text-muted-foreground">
                        Create AI agents with specialized knowledge and personality
                      </p>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-secondary/30 rounded-lg">
                      <Workflow className="h-10 w-10 text-primary mb-2" />
                      <h3 className="text-lg font-medium">Workflow Automation</h3>
                      <p className="text-sm text-center text-muted-foreground">
                        Build automated workflows to handle complex tasks
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button onClick={handleCreateAgentClick}>Get Started</Button>
                </CardFooter>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Create</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Design your AI agent with specialized knowledge, personality, and instructions
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Customize</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Fine-tune your agent's behavior, appearance, and deployment options
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Deploy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Share your agent as a web app, API, or embedded widget
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="demo">
              <Card>
                <CardHeader>
                  <CardTitle>Try a Demo Agent</CardTitle>
                  <CardDescription>Interact with one of our pre-built AI agents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <AgentChat agent={demoAgent} />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button onClick={handleCreateAgentClick}>Create Your Own Agent</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleFeatureClick("Agent Creation")}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Brain className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-lg">Agent Creation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Create custom AI agents with specialized knowledge and personality for any niche
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" onClick={handleCreateAgentClick} className="w-full">
                      Create Agent
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleFeatureClick("Templates")}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <FileCode className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-lg">Template Library</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Browse and use pre-configured templates for different niches and use cases
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" onClick={handleTemplatesClick} className="w-full">
                      Browse Templates
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleFeatureClick("Workflow Automation")}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Workflow className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-lg">Workflow Automation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Design automated workflows that integrate with your AI agents and external services
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" onClick={handleWorkflowsClick} className="w-full">
                      Explore Workflows
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleFeatureClick("Data Analysis")}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center">
                      <Database className="h-5 w-5 mr-2 text-primary" />
                      <CardTitle className="text-lg">Data Integration</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Connect your agents to data sources and analyze information to provide better responses
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" onClick={() => navigate("/data-analysis")} className="w-full">
                      Data Tools
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Ready to get started?</CardTitle>
                  <CardDescription>Create your first AI agent in minutes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-6">
                    Our platform makes it easy to create powerful AI agents without any coding experience.
                    Choose a template or start from scratch to build your custom agent.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button size="lg" onClick={handleCreateAgentClick}>
                    Create Your First Agent
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MVPPage;
