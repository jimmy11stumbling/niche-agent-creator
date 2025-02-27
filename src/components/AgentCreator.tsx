
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  Brain,
  MessageSquare,
  FileText,
  Download,
  RefreshCw,
  CheckCircle2,
  UserPlus,
  Upload,
  Globe,
  Code,
  PanelRightClose,
} from "lucide-react";
import ModelSelector from "./ModelSelector";
import AgentPreview from "./AgentPreview";
import TemplatesGallery from "./TemplatesGallery";
import { pipeline } from "@huggingface/transformers";

// Hugging Face access token
const HF_TOKEN = "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";

const AgentCreator = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("basics");
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [agent, setAgent] = useState({
    name: "",
    description: "",
    niche: "",
    personality: "",
    systemPrompt: "",
    exampleConversations: "",
    deploymentMethod: "web",
    isModelDownloaded: false,
    selectedModel: "llama-3.2-3B",
    model: null,
  });

  useEffect(() => {
    // Check for previously saved agent in localStorage
    const savedAgent = localStorage.getItem("agentDraft");
    if (savedAgent) {
      try {
        const parsedAgent = JSON.parse(savedAgent);
        setAgent(parsedAgent);
        toast({
          title: "Draft Loaded",
          description: "Your previously saved agent draft has been loaded.",
        });
      } catch (e) {
        console.error("Error loading saved agent:", e);
      }
    }
  }, []);

  const updateAgent = (field: string, value: string) => {
    setAgent((prev) => {
      const updatedAgent = { ...prev, [field]: value };
      // Save draft to localStorage
      localStorage.setItem("agentDraft", JSON.stringify(updatedAgent));
      return updatedAgent;
    });
  };

  // Actual implementation of model download with progress tracking
  const downloadModel = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadError(null);
    
    try {
      // Setup progress callback
      const progressCallback = (progress: { progress: number }) => {
        setDownloadProgress(Math.round(progress.progress * 100));
      };

      // Use the Hugging Face transformers.js library to download and set up the model
      const modelId = "meta-llama/Meta-Llama-3.2-3B";
      console.log(`Starting download of model: ${modelId}`);
      
      // Initialize the text-generation pipeline with progress tracking
      const textGenerationPipeline = await pipeline(
        'text-generation',
        modelId,
        {
          progress_callback: progressCallback,
          quantized: true, // Use quantized model for better performance
          token: HF_TOKEN
        }
      );
      
      console.log("Model download complete");
      
      // Update agent state with the downloaded model
      setAgent((prev) => {
        const updatedAgent = { 
          ...prev, 
          isModelDownloaded: true, 
          model: textGenerationPipeline 
        };
        localStorage.setItem("agentDraft", JSON.stringify({
          ...updatedAgent,
          model: null // Don't store the actual model in localStorage
        }));
        return updatedAgent;
      });
      
      setIsDownloading(false);
      setDownloadProgress(100);
      
      toast({
        title: "Model Downloaded Successfully",
        description: "The model has been downloaded and is ready to use.",
      });
    } catch (error) {
      console.error("Error downloading model:", error);
      setIsDownloading(false);
      setDownloadError(error instanceof Error ? error.message : "Unknown error occurred");
      
      toast({
        title: "Download Failed",
        description: `Error downloading model: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  const handleCreateAgent = () => {
    if (!agent.name || !agent.description || !agent.systemPrompt) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!agent.isModelDownloaded) {
      toast({
        title: "Model Not Downloaded",
        description: "Please download the model before creating your agent.",
        variant: "destructive",
      });
      return;
    }

    // Generate a unique ID for the agent
    const agentId = Date.now().toString();
    
    // Save the agent to localStorage for persistence
    const agents = JSON.parse(localStorage.getItem("agents") || "[]");
    const newAgent = {
      ...agent,
      id: agentId,
      createdAt: new Date().toISOString(),
      model: null // Don't store the model object itself
    };
    
    localStorage.setItem("agents", JSON.stringify([...agents, newAgent]));
    localStorage.setItem("currentAgent", JSON.stringify(newAgent));
    
    toast({
      title: "Agent Created Successfully",
      description: "Your AI agent has been created and is ready to deploy.",
    });
    
    // Navigate to deployment page
    navigate(`/deploy/${agentId}`);
  };

  const handleTemplateSelect = (template: any) => {
    const updatedAgent = {
      ...agent,
      name: template.name,
      description: template.description,
      niche: template.niche,
      personality: template.personality || "",
      systemPrompt: template.systemPrompt || "",
      exampleConversations: template.exampleConversations || "",
    };
    
    setAgent(updatedAgent);
    localStorage.setItem("agentDraft", JSON.stringify(updatedAgent));
    
    toast({
      title: "Template Applied",
      description: `The "${template.name}" template has been applied.`,
    });
  };

  const generateResponse = async (userPrompt: string) => {
    if (!agent.model) return "The model is not loaded yet.";
    
    try {
      // Prepare the system prompt and context
      const context = `${agent.systemPrompt}\n\nUser: ${userPrompt}\nAssistant:`;
      
      // Generate response from the model
      const response = await agent.model(context, {
        max_new_tokens: 256,
        temperature: 0.7,
        top_p: 0.95,
        do_sample: true,
      });
      
      const generatedText = response[0].generated_text;
      // Extract just the Assistant's response
      const assistantResponse = generatedText.split("Assistant:")[1].trim();
      
      return assistantResponse;
    } catch (error) {
      console.error("Error generating response:", error);
      return "I'm sorry, I encountered an error while processing your request.";
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <h1 className="text-4xl font-bold text-center mb-2 gradient-text">Niche Agent Creator</h1>
      <p className="text-center text-muted-foreground mb-8">
        Create custom AI agents for any niche using powerful language models
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <Card className="col-span-1 lg:col-span-3 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5" />
              Create Your AI Agent
            </CardTitle>
            <CardDescription>
              Customize every aspect of your AI agent to suit your specific needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basics" value={currentStep} onValueChange={setCurrentStep}>
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="basics">Basics</TabsTrigger>
                <TabsTrigger value="personality">Personality</TabsTrigger>
                <TabsTrigger value="model">Model</TabsTrigger>
                <TabsTrigger value="deploy">Deploy</TabsTrigger>
              </TabsList>

              <TabsContent value="basics" className="space-y-4 slide-in">
                <div className="space-y-2">
                  <Label htmlFor="name">Agent Name</Label>
                  <Input
                    id="name"
                    placeholder="E.g., Finance Expert, Fitness Coach, etc."
                    value={agent.name}
                    onChange={(e) => updateAgent("name", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="niche">Agent Niche</Label>
                  <Input
                    id="niche"
                    placeholder="E.g., Personal Finance, Fitness, Marketing, etc."
                    value={agent.niche}
                    onChange={(e) => updateAgent("niche", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what your agent does and who it's for..."
                    className="min-h-[100px]"
                    value={agent.description}
                    onChange={(e) => updateAgent("description", e.target.value)}
                  />
                </div>

                <div className="pt-4">
                  <Button onClick={() => setCurrentStep("personality")} className="w-full">
                    Continue to Personality
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="personality" className="space-y-4 slide-in">
                <div className="space-y-2">
                  <Label htmlFor="personality">Personality Traits</Label>
                  <Textarea
                    id="personality"
                    placeholder="Describe how your agent should behave (friendly, professional, humorous, etc.)"
                    className="min-h-[100px]"
                    value={agent.personality}
                    onChange={(e) => updateAgent("personality", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="systemPrompt">System Prompt</Label>
                  <Textarea
                    id="systemPrompt"
                    placeholder="Write instructions that define how your agent should respond..."
                    className="min-h-[150px]"
                    value={agent.systemPrompt}
                    onChange={(e) => updateAgent("systemPrompt", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="exampleConversations">Example Conversations (Optional)</Label>
                  <Textarea
                    id="exampleConversations"
                    placeholder="Provide example Q&A pairs to guide your agent's responses..."
                    className="min-h-[100px]"
                    value={agent.exampleConversations}
                    onChange={(e) => updateAgent("exampleConversations", e.target.value)}
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setCurrentStep("basics")}>
                    Back
                  </Button>
                  <Button onClick={() => setCurrentStep("model")}>
                    Continue to Model Selection
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="model" className="space-y-6 slide-in">
                <ModelSelector
                  selectedModel={agent.selectedModel}
                  onSelectModel={(model) => updateAgent("selectedModel", model)}
                />
                
                <Separator className="my-4" />
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">Download Model</h3>
                      <p className="text-sm text-muted-foreground">
                        Download the model to use it for your agent
                      </p>
                    </div>
                    <Button
                      onClick={downloadModel}
                      disabled={isDownloading || agent.isModelDownloaded}
                      className="flex items-center"
                    >
                      {agent.isModelDownloaded ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Downloaded
                        </>
                      ) : isDownloading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download Model
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {(isDownloading || agent.isModelDownloaded) && (
                    <div className="space-y-2">
                      <Progress value={downloadProgress} className="h-2" />
                      {isDownloading && (
                        <p className="text-xs text-muted-foreground">
                          Downloading model... {Math.round(downloadProgress)}%
                        </p>
                      )}
                    </div>
                  )}
                  
                  {downloadError && (
                    <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                      <p>Error downloading model: {downloadError}</p>
                      <p className="mt-1">Please check your internet connection and try again.</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setCurrentStep("personality")}>
                    Back
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep("deploy")}
                    disabled={!agent.isModelDownloaded}
                  >
                    Continue to Deployment
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="deploy" className="space-y-6 slide-in">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Deployment Options</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card 
                      className={`cursor-pointer hover:border-primary transition-all ${
                        agent.deploymentMethod === "web" ? "border-primary" : ""
                      }`}
                      onClick={() => updateAgent("deploymentMethod", "web")}
                    >
                      <CardHeader className="pb-2">
                        <Globe className="h-8 w-8 text-primary mb-2" />
                        <CardTitle className="text-base">Web App</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Deploy as a web application with custom URL
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card 
                      className={`cursor-pointer hover:border-primary transition-all ${
                        agent.deploymentMethod === "api" ? "border-primary" : ""
                      }`}
                      onClick={() => updateAgent("deploymentMethod", "api")}
                    >
                      <CardHeader className="pb-2">
                        <Code className="h-8 w-8 text-primary mb-2" />
                        <CardTitle className="text-base">API</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Deploy as an API endpoint for integration
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card 
                      className={`cursor-pointer hover:border-primary transition-all ${
                        agent.deploymentMethod === "widget" ? "border-primary" : ""
                      }`}
                      onClick={() => updateAgent("deploymentMethod", "widget")}
                    >
                      <CardHeader className="pb-2">
                        <PanelRightClose className="h-8 w-8 text-primary mb-2" />
                        <CardTitle className="text-base">Widget</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Embed as a chat widget on your website
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setCurrentStep("model")}>
                    Back
                  </Button>
                  <Button onClick={handleCreateAgent}>
                    Create Agent
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="mr-2 h-5 w-5" />
              Agent Preview
            </CardTitle>
            <CardDescription>
              See how your agent will look and behave
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[500px] overflow-auto">
            <AgentPreview agent={agent} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Templates Gallery</h2>
        <p className="text-muted-foreground mb-6">
          Start with a pre-configured template to save time
        </p>
        <TemplatesGallery onSelectTemplate={handleTemplateSelect} />
      </div>
    </div>
  );
};

export default AgentCreator;
