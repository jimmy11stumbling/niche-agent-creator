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
import { Switch } from "@/components/ui/switch";
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
  AlertTriangle,
} from "lucide-react";
import ModelSelector from "./ModelSelector";
import AgentPreview from "./AgentPreview";
import TemplatesGallery from "./TemplatesGallery";
import { pipeline } from "@huggingface/transformers";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const USE_DEMO_MODE = true;

const AVAILABLE_MODELS = {
  "llama-3.2-3B": {
    id: "meta-llama/Meta-Llama-3.2-3B",
    description: "Meta's smallest Llama 3.2 model optimized for performance",
    requiresAuth: true,
  },
  "llama-3.1-1B": {
    id: "meta-llama/Meta-Llama-3.1-1B", 
    description: "Smaller 1B parameter model from Meta",
    requiresAuth: true,
  },
  "gemma-2b": {
    id: "google/gemma-2b", 
    description: "Google's 2B parameter open model",
    requiresAuth: false,
  },
  "mistral-7b": { 
    id: "mistralai/Mistral-7B-v0.1", 
    description: "Mistral AI's high-quality 7B parameter model",
    requiresAuth: false,
  },
};

const AgentCreator = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState("basics");
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [isHFTokenModalOpen, setIsHFTokenModalOpen] = useState(false);
  const [hfToken, setHfToken] = useState("");
  const [useDemoMode, setUseDemoMode] = useState(USE_DEMO_MODE);
  const [agent, setAgent] = useState({
    name: "",
    description: "",
    niche: "",
    personality: "",
    systemPrompt: "",
    exampleConversations: "",
    deploymentMethod: "web",
    isModelDownloaded: false,
    selectedModel: "gemma-2b",
    model: null,
  });

  useEffect(() => {
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
    
    const savedToken = localStorage.getItem("hfToken");
    if (savedToken) {
      setHfToken(savedToken);
    }
  }, []);

  const updateAgent = (field: string, value: string) => {
    setAgent((prev) => {
      const updatedAgent = { ...prev, [field]: value };
      localStorage.setItem("agentDraft", JSON.stringify(updatedAgent));
      return updatedAgent;
    });
  };

  const handleHFTokenSubmit = () => {
    if (hfToken.trim()) {
      localStorage.setItem("hfToken", hfToken);
      setIsHFTokenModalOpen(false);
      toast({
        title: "Token Saved",
        description: "Your Hugging Face token has been saved.",
      });
      downloadModel();
    } else {
      toast({
        title: "Token Required",
        description: "Please enter a valid Hugging Face token.",
        variant: "destructive",
      });
    }
  };

  const downloadModel = async () => {
    if (AVAILABLE_MODELS[agent.selectedModel]?.requiresAuth && !hfToken) {
      setIsHFTokenModalOpen(true);
      return;
    }
    
    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadError(null);
    
    try {
      const progressCallback = (progressInfo: any) => {
        if ('progress' in progressInfo) {
          setDownloadProgress(Math.round(progressInfo.progress * 100));
        } else if ('loaded' in progressInfo && 'total' in progressInfo) {
          const progress = progressInfo.loaded / progressInfo.total;
          setDownloadProgress(Math.round(progress * 100));
        } else {
          console.log("Progress event:", progressInfo);
        }
      };

      const modelId = AVAILABLE_MODELS[agent.selectedModel]?.id || "google/gemma-2b";
      console.log(`Starting download of model: ${modelId}`);
      
      const pipelineOptions: any = {
        progress_callback: progressCallback,
      };
      
      if (AVAILABLE_MODELS[agent.selectedModel]?.requiresAuth && hfToken) {
        pipelineOptions.token = hfToken;
      }
      
      const textGenerationPipeline = await pipeline(
        'text-generation',
        modelId,
        pipelineOptions
      );
      
      console.log("Model download complete");
      
      setAgent((prev) => {
        const updatedAgent = { 
          ...prev, 
          isModelDownloaded: true, 
          model: textGenerationPipeline 
        };
        localStorage.setItem("agentDraft", JSON.stringify({
          ...updatedAgent,
          model: null
        }));
        return updatedAgent;
      });
      
      setIsDownloading(false);
      setDownloadProgress(100);
      setUseDemoMode(false);
      
      toast({
        title: "Model Downloaded Successfully",
        description: "The model has been downloaded and is ready to use.",
      });
    } catch (error) {
      console.error("Error downloading model:", error);
      setIsDownloading(false);
      
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setDownloadError(errorMessage);
      
      if (errorMessage.includes("Unauthorized") || errorMessage.includes("Invalid username or password")) {
        setIsHFTokenModalOpen(true);
        toast({
          title: "Authorization Failed",
          description: "This model requires a Hugging Face token for access.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Download Failed",
          description: `Error downloading model: ${errorMessage}`,
          variant: "destructive",
        });
      }
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

    if (!agent.isModelDownloaded && !useDemoMode) {
      toast({
        title: "Model Not Downloaded",
        description: "Please download the model or enable demo mode to continue.",
        variant: "destructive",
      });
      return;
    }

    const agentId = Date.now().toString();
    
    const agents = JSON.parse(localStorage.getItem("agents") || "[]");
    const newAgent = {
      ...agent,
      id: agentId,
      createdAt: new Date().toISOString(),
      useDemoMode,
      model: null
    };
    
    localStorage.setItem("agents", JSON.stringify([...agents, newAgent]));
    localStorage.setItem("currentAgent", JSON.stringify(newAgent));
    
    toast({
      title: "Agent Created Successfully",
      description: "Your AI agent has been created and is ready to deploy.",
    });
    
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
    if (!agent.model && !useDemoMode) return "The model is not loaded yet.";
    
    try {
      if (useDemoMode) {
        return simulateResponse(userPrompt, agent);
      }
      
      const context = `${agent.systemPrompt}\n\nUser: ${userPrompt}\nAssistant:`;
      
      const response = await agent.model(context, {
        max_new_tokens: 256,
        temperature: 0.7,
        top_p: 0.95,
        do_sample: true,
      });
      
      const generatedText = response[0].generated_text;
      const assistantResponse = generatedText.split("Assistant:")[1]?.trim() || "I don't have a response for that yet.";
      
      return assistantResponse;
    } catch (error) {
      console.error("Error generating response:", error);
      return "I encountered an error while processing your request. Please try again.";
    }
  };

  const simulateResponse = (userPrompt: string, agentConfig: any) => {
    const { niche, personality, systemPrompt } = agentConfig;
    
    if (niche.toLowerCase().includes("finance")) {
      return "Based on best financial practices, I recommend diversifying your investments across different asset classes. This helps reduce risk while potentially increasing returns. Would you like me to elaborate on specific investment strategies?";
    } else if (niche.toLowerCase().includes("fitness")) {
      return "For optimal fitness results, consistency is key. I'd recommend a balanced routine of strength training, cardio, and adequate recovery. Would you like me to suggest a specific workout plan based on your goals?";
    } else if (niche.toLowerCase().includes("marketing")) {
      return "Effective marketing strategies are data-driven and customer-focused. Consider leveraging social media analytics to understand your audience better and create targeted content that resonates with them. Would you like specific suggestions for your marketing campaign?";
    } else if (niche.toLowerCase().includes("tech") || niche.toLowerCase().includes("programming")) {
      return "When approaching this technical challenge, I'd recommend breaking it down into smaller, more manageable components. This modular approach makes debugging easier and improves code maintainability. Would you like me to walk you through the implementation steps?";
    } else if (niche.toLowerCase().includes("health") || niche.toLowerCase().includes("nutrition")) {
      return "Maintaining optimal health involves balancing nutrition, physical activity, and mental wellbeing. For nutrition specifically, focus on whole foods, adequate protein intake, and staying hydrated. Would you like personalized health recommendations?";
    } else {
      return `I understand your question about "${userPrompt.substring(0, 30)}...". As your ${niche || "specialized"} assistant, I'm here to help with expert guidance tailored to your needs. Could you provide more details so I can give you the most relevant information?`;
    }
  };

  const toggleDemoMode = () => {
    setUseDemoMode(!useDemoMode);
    if (!useDemoMode) {
      setAgent(prev => ({
        ...prev,
        isModelDownloaded: true
      }));
      toast({
        title: "Demo Mode Enabled",
        description: "You can now create and test agents without downloading models.",
      });
    } else {
      if (!agent.model) {
        setAgent(prev => ({
          ...prev,
          isModelDownloaded: false
        }));
      }
      toast({
        title: "Demo Mode Disabled",
        description: "Agents will require model download for full functionality.",
      });
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
                <div className="flex items-center space-x-2 mb-4">
                  <Switch 
                    checked={useDemoMode} 
                    onCheckedChange={toggleDemoMode} 
                    id="demo-mode"
                  />
                  <Label htmlFor="demo-mode" className="font-medium">
                    Enable Demo Mode
                  </Label>
                  <div className="ml-2 text-xs text-muted-foreground">
                    (Use simulated responses when models can't be downloaded)
                  </div>
                </div>

                {!useDemoMode && (
                  <>
                    <ModelSelector
                      selectedModel={agent.selectedModel}
                      onSelectModel={(model) => updateAgent("selectedModel", model)}
                      models={Object.keys(AVAILABLE_MODELS).map(key => ({
                        id: key,
                        name: key,
                        description: AVAILABLE_MODELS[key].description,
                        requiresAuth: AVAILABLE_MODELS[key].requiresAuth
                      }))}
                    />
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-lg font-medium">Download Model</h3>
                          <p className="text-sm text-muted-foreground">
                            Download the model to use it for your agent
                          </p>
                          {AVAILABLE_MODELS[agent.selectedModel]?.requiresAuth && (
                            <p className="text-xs text-amber-600 flex items-center mt-1">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              This model requires Hugging Face authentication
                            </p>
                          )}
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
                          <p className="mt-1 flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Try enabling Demo Mode above to create your agent without downloading the model.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {useDemoMode && (
                  <div className="bg-secondary/50 p-4 rounded-md">
                    <h3 className="text-lg font-medium mb-2 flex items-center">
                      <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
                      Demo Mode Active
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      You can create and test your agent with simulated AI responses. No model download required.
                    </p>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setCurrentStep("personality")}>
                    Back
                  </Button>
                  <Button 
                    onClick={() => setCurrentStep("deploy")}
                    disabled={!agent.isModelDownloaded && !useDemoMode}
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
            <AgentPreview agent={{...agent, generateResponse, useDemoMode}} />
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

      <Dialog open={isHFTokenModalOpen} onOpenChange={setIsHFTokenModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Hugging Face Token Required</DialogTitle>
            <DialogDescription>
              This model requires authentication. Please enter your Hugging Face token to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="hf-token">Hugging Face Token</Label>
              <Input
                id="hf-token"
                type="password"
                placeholder="hf_..."
                value={hfToken}
                onChange={(e) => setHfToken(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                You can get a token from <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">huggingface.co/settings/tokens</a>
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsHFTokenModalOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleHFTokenSubmit}>
              Save Token & Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentCreator;
