
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { 
  Rocket, 
  Globe, 
  Code, 
  PanelRightClose, 
  Copy, 
  CheckCircle, 
  RefreshCw,
  ExternalLink,
  AlertCircle,
  Shield,
  LineChart
} from "lucide-react";

interface DeploymentWizardProps {
  agent: {
    id: string;
    name: string;
    niche: string;
    deploymentMethod: string;
  };
}

const DeploymentWizard = ({ agent }: DeploymentWizardProps) => {
  const { toast } = useToast();
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success' | 'failed'>('idle');
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [deploymentUrl, setDeploymentUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [widgetCode, setWidgetCode] = useState("");
  const [activeTab, setActiveTab] = useState(agent.deploymentMethod || "web");
  const [deploymentSettings, setDeploymentSettings] = useState({
    customDomain: "",
    allowUserFeedback: true,
    enableAnalytics: true,
    enableLogging: true,
    rateLimit: 10,
    privateMode: false,
    customization: {
      primaryColor: "#2563eb",
      fontFamily: "Inter",
      darkMode: false,
      logoUrl: "",
    }
  });

  // Update active tab when agent.deploymentMethod changes
  useEffect(() => {
    if (agent.deploymentMethod) {
      setActiveTab(agent.deploymentMethod);
    }
  }, [agent.deploymentMethod]);

  const handleSettingsChange = (key: string, value: any) => {
    setDeploymentSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleCustomizationChange = (key: string, value: any) => {
    setDeploymentSettings(prev => ({
      ...prev,
      customization: {
        ...prev.customization,
        [key]: value
      }
    }));
  };

  const simulateDeployment = () => {
    // Save deployment method to localStorage
    const savedAgent = localStorage.getItem("currentAgent");
    if (savedAgent) {
      const parsedAgent = JSON.parse(savedAgent);
      parsedAgent.deploymentMethod = activeTab;
      localStorage.setItem("currentAgent", JSON.stringify(parsedAgent));
    }
    
    setDeploymentStatus('deploying');
    setDeploymentProgress(0);
    
    const deploymentTime = Math.random() * 5000 + 5000; // 5-10 seconds
    const interval = setInterval(() => {
      setDeploymentProgress((prev) => {
        const increment = Math.random() * 10;
        if (prev >= 100) {
          clearInterval(interval);
          
          // Small chance of deployment failure for realism
          const deploySuccess = Math.random() > 0.05;
          
          if (deploySuccess) {
            setDeploymentStatus('success');
            
            // Generate deployment URL based on agent name
            const slugifiedName = agent.name.toLowerCase().replace(/\s+/g, '-');
            const mockUrl = `https://${slugifiedName}-${Math.random().toString(36).substring(2, 6)}.ai-agents.example.com`;
            setDeploymentUrl(mockUrl);
            
            // Generate API key
            setApiKey(`sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`);
            
            // Generate widget code
            const agentId = Math.random().toString(36).substring(2, 10);
            setWidgetCode(`<script src="https://cdn.ai-agents.com/widget.js" id="ai-agent-widget" data-agent-id="${agentId}"></script>`);
            
            // Save deployment info to localStorage
            const deploymentInfo = {
              agentId: agent.id,
              deploymentMethod: activeTab,
              deploymentUrl: mockUrl,
              apiKey: `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
              widgetCode: `<script src="https://cdn.ai-agents.com/widget.js" id="ai-agent-widget" data-agent-id="${agentId}"></script>`,
              deployedAt: new Date().toISOString(),
              settings: deploymentSettings
            };
            
            const deployments = JSON.parse(localStorage.getItem("deployments") || "[]");
            localStorage.setItem("deployments", JSON.stringify([...deployments, deploymentInfo]));
            
            toast({
              title: "Deployment Successful",
              description: `Your AI agent "${agent.name}" has been deployed and is ready to use.`,
            });
          } else {
            setDeploymentStatus('failed');
            toast({
              title: "Deployment Failed",
              description: "There was an error deploying your agent. Please try again.",
              variant: "destructive",
            });
          }
          
          return 100;
        }
        return Math.min(prev + increment, 99);
      });
    }, deploymentTime / 20); // Update about 20 times during deployment
  };

  const copyToClipboard = (text: string, successMessage: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: successMessage,
      });
    });
  };

  const retryDeployment = () => {
    setDeploymentStatus('idle');
    setDeploymentProgress(0);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Rocket className="mr-2 h-5 w-5" />
          Deploy "{agent.name}"
        </CardTitle>
        <CardDescription>
          Configure and deploy your AI agent to make it available to users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="web">
              <Globe className="h-4 w-4 mr-2" />
              Web App
            </TabsTrigger>
            <TabsTrigger value="api">
              <Code className="h-4 w-4 mr-2" />
              API
            </TabsTrigger>
            <TabsTrigger value="widget">
              <PanelRightClose className="h-4 w-4 mr-2" />
              Widget
            </TabsTrigger>
          </TabsList>

          <TabsContent value="web" className="space-y-6 slide-in">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customDomain">Custom Domain (Optional)</Label>
                <Input
                  id="customDomain"
                  placeholder="youragent.yourdomain.com"
                  value={deploymentSettings.customDomain}
                  onChange={(e) => handleSettingsChange("customDomain", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank to use our default domain
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Web App Settings</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableAnalytics">Usage Analytics</Label>
                    <p className="text-xs text-muted-foreground">Track interactions and user behavior</p>
                  </div>
                  <Switch
                    id="enableAnalytics"
                    checked={deploymentSettings.enableAnalytics}
                    onCheckedChange={(checked) => handleSettingsChange("enableAnalytics", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowUserFeedback">User Feedback</Label>
                    <p className="text-xs text-muted-foreground">Allow users to rate responses</p>
                  </div>
                  <Switch
                    id="allowUserFeedback"
                    checked={deploymentSettings.allowUserFeedback}
                    onCheckedChange={(checked) => handleSettingsChange("allowUserFeedback", checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="privateMode">Private Mode</Label>
                    <p className="text-xs text-muted-foreground">Require login to access the agent</p>
                  </div>
                  <Switch
                    id="privateMode"
                    checked={deploymentSettings.privateMode}
                    onCheckedChange={(checked) => handleSettingsChange("privateMode", checked)}
                  />
                </div>
              </div>
              
              <Separator />
              
              {deploymentStatus === 'success' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-secondary p-3 rounded-md">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-primary" />
                      <span className="font-medium text-sm">{deploymentUrl}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8"
                        onClick={() => copyToClipboard(deploymentUrl, "URL copied to clipboard")}
                      >
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8"
                        onClick={() => window.open(deploymentUrl, '_blank')}
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1" />
                        Visit
                      </Button>
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <h3 className="text-sm font-medium mb-2">Deployment Status</h3>
                    <div className="flex items-center text-sm text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Live and running
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Your web app is deployed and available at the URL above
                    </p>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <LineChart className="h-4 w-4 mr-2 text-primary" />
                      Analytics Dashboard
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      Monitor usage, performance, and user feedback
                    </p>
                    <Button
                      size="sm"
                      onClick={() => window.open(`${deploymentUrl}/dashboard`, '_blank')}
                    >
                      View Dashboard
                    </Button>
                  </div>
                </div>
              ) : deploymentStatus === 'failed' ? (
                <div className="space-y-4">
                  <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-sm">Deployment Failed</h3>
                      <p className="text-sm mt-1">
                        There was a problem deploying your agent. This could be due to network issues or resource constraints.
                      </p>
                    </div>
                  </div>
                  <Button onClick={retryDeployment} className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry Deployment
                  </Button>
                </div>
              ) : (
                <div>
                  {deploymentStatus === 'deploying' ? (
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        <span>Deploying your AI agent...</span>
                      </div>
                      <Progress value={deploymentProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {deploymentProgress < 30 ? "Setting up environment..." : 
                         deploymentProgress < 60 ? "Configuring the agent..." : 
                         deploymentProgress < 90 ? "Finalizing deployment..." : 
                         "Almost done..."}
                      </p>
                    </div>
                  ) : (
                    <Button onClick={simulateDeployment} className="w-full">
                      <Rocket className="mr-2 h-4 w-4" />
                      Deploy Web App
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-6 slide-in">
            <div className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">API Settings</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableLogging">Request Logging</Label>
                    <p className="text-xs text-muted-foreground">Log API requests for debugging</p>
                  </div>
                  <Switch
                    id="enableLogging"
                    checked={deploymentSettings.enableLogging}
                    onCheckedChange={(checked) => handleSettingsChange("enableLogging", checked)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rateLimit">Rate Limit (requests per minute)</Label>
                  <Input
                    id="rateLimit"
                    type="number"
                    min="1"
                    max="100"
                    value={deploymentSettings.rateLimit}
                    onChange={(e) => handleSettingsChange("rateLimit", parseInt(e.target.value))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Limit the number of requests per minute per API key
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-1 text-primary" />
                      <Label htmlFor="privateMode">Enhanced Security</Label>
                    </div>
                    <p className="text-xs text-muted-foreground">Enable IP whitelisting and request signing</p>
                  </div>
                  <Switch
                    id="privateMode"
                    checked={deploymentSettings.privateMode}
                    onCheckedChange={(checked) => handleSettingsChange("privateMode", checked)}
                  />
                </div>
              </div>
              
              <Separator />
              
              {deploymentStatus === 'success' ? (
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <h3 className="text-sm font-medium mb-2">API Endpoint</h3>
                    <div className="flex items-center justify-between bg-secondary p-2 rounded-md text-sm">
                      <code>https://api.ai-agents.com/v1/agents/{agent.name.toLowerCase().replace(/\s+/g, '-')}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7"
                        onClick={() => copyToClipboard(`https://api.ai-agents.com/v1/agents/${agent.name.toLowerCase().replace(/\s+/g, '-')}`, "API endpoint copied to clipboard")}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <h3 className="text-sm font-medium mb-2">API Key</h3>
                    <div className="flex items-center justify-between bg-secondary p-2 rounded-md text-sm">
                      <code>{apiKey}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7"
                        onClick={() => copyToClipboard(apiKey, "API key copied to clipboard")}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Keep this key secret! It grants full access to your agent.
                    </p>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <h3 className="text-sm font-medium mb-2">Example Request</h3>
                    <div className="bg-secondary p-2 rounded-md text-sm overflow-x-auto">
                      <pre className="text-xs">
{`fetch('https://api.ai-agents.com/v1/agents/${agent.name.toLowerCase().replace(/\s+/g, '-')}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${apiKey}'
  },
  body: JSON.stringify({
    messages: [
      { role: "user", content: "Hello, can you help me with ${agent.niche}?" }
    ]
  })
})
.then(response => response.json())
.then(data => console.log(data));`}
                      </pre>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => copyToClipboard(`fetch('https://api.ai-agents.com/v1/agents/${agent.name.toLowerCase().replace(/\s+/g, '-')}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${apiKey}'
  },
  body: JSON.stringify({
    messages: [
      { role: "user", content: "Hello, can you help me with ${agent.niche}?" }
    ]
  })
})
.then(response => response.json())
.then(data => console.log(data));`, "Example code copied to clipboard")}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy Example
                    </Button>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <h3 className="text-sm font-medium mb-2">Documentation</h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      Access detailed API documentation for integration
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open("https://docs.ai-agents.com/api", "_blank")}
                    >
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      View API Docs
                    </Button>
                  </div>
                </div>
              ) : deploymentStatus === 'failed' ? (
                <div className="space-y-4">
                  <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-sm">Deployment Failed</h3>
                      <p className="text-sm mt-1">
                        There was a problem setting up the API. Please try again or contact support if the issue persists.
                      </p>
                    </div>
                  </div>
                  <Button onClick={retryDeployment} className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry Deployment
                  </Button>
                </div>
              ) : (
                <div>
                  {deploymentStatus === 'deploying' ? (
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        <span>Setting up API endpoints...</span>
                      </div>
                      <Progress value={deploymentProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {deploymentProgress < 30 ? "Configuring API gateway..." : 
                         deploymentProgress < 60 ? "Setting up authentication..." : 
                         deploymentProgress < 90 ? "Finalizing API endpoints..." : 
                         "Almost done..."}
                      </p>
                    </div>
                  ) : (
                    <Button onClick={simulateDeployment} className="w-full">
                      <Code className="mr-2 h-4 w-4" />
                      Deploy API
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="widget" className="space-y-6 slide-in">
            <div className="space-y-4">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Widget Customization</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="primaryColor"
                      value={deploymentSettings.customization.primaryColor}
                      onChange={(e) => handleCustomizationChange("primaryColor", e.target.value)}
                      className="w-12 h-10 p-1"
                    />
                    <Input
                      type="text"
                      value={deploymentSettings.customization.primaryColor}
                      onChange={(e) => handleCustomizationChange("primaryColor", e.target.value)}
                      className="flex-1"
                      placeholder="#2563eb"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Input
                    id="fontFamily"
                    value={deploymentSettings.customization.fontFamily}
                    onChange={(e) => handleCustomizationChange("fontFamily", e.target.value)}
                    placeholder="Inter, system-ui, sans-serif"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Custom Logo URL (optional)</Label>
                  <Input
                    id="logoUrl"
                    value={deploymentSettings.customization.logoUrl}
                    onChange={(e) => handleCustomizationChange("logoUrl", e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <p className="text-xs text-muted-foreground">Enable dark mode by default</p>
                  </div>
                  <Switch
                    id="darkMode"
                    checked={deploymentSettings.customization.darkMode}
                    onCheckedChange={(checked) => handleCustomizationChange("darkMode", checked)}
                  />
                </div>
              </div>
              
              <Separator />
              
              {deploymentStatus === 'success' ? (
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <h3 className="text-sm font-medium mb-2">Widget Code</h3>
                    <div className="flex items-center justify-between bg-secondary p-2 rounded-md text-sm">
                      <code>{widgetCode}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7"
                        onClick={() => copyToClipboard(widgetCode, "Widget code copied to clipboard")}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Add this code to your website to embed the AI agent widget
                    </p>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <h3 className="text-sm font-medium mb-2">Customization Options</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Customize the appearance of your widget with these attributes
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <code className="bg-secondary p-1 rounded">data-position="right"</code>
                        <span className="text-xs">Widget position (right or left)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <code className="bg-secondary p-1 rounded">data-theme="{deploymentSettings.customization.darkMode ? 'dark' : 'light'}"</code>
                        <span className="text-xs">Widget theme (light or dark)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <code className="bg-secondary p-1 rounded">data-primary-color="{deploymentSettings.customization.primaryColor}"</code>
                        <span className="text-xs">Custom brand color</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <code className="bg-secondary p-1 rounded">data-icon="true"</code>
                        <span className="text-xs">Show icon (true or false)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <h3 className="text-sm font-medium mb-2">Example</h3>
                    <pre className="bg-secondary p-2 rounded-md text-xs overflow-x-auto">
{`<script 
  src="https://cdn.ai-agents.com/widget.js" 
  id="ai-agent-widget" 
  data-agent-id="${Math.random().toString(36).substring(2, 10)}"
  data-position="right"
  data-theme="${deploymentSettings.customization.darkMode ? 'dark' : 'light'}"
  data-primary-color="${deploymentSettings.customization.primaryColor}"
  data-icon="true"
></script>`}
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => copyToClipboard(`<script 
  src="https://cdn.ai-agents.com/widget.js" 
  id="ai-agent-widget" 
  data-agent-id="${Math.random().toString(36).substring(2, 10)}"
  data-position="right"
  data-theme="${deploymentSettings.customization.darkMode ? 'dark' : 'light'}"
  data-primary-color="${deploymentSettings.customization.primaryColor}"
  data-icon="true"
></script>`, "Example code copied to clipboard")}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy Example
                    </Button>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <h3 className="text-sm font-medium mb-2">Preview</h3>
                    <Button
                      variant="outline"
                      onClick={() => window.open("https://preview.ai-agents.com/widget/" + agent.id, "_blank")}
                    >
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      Preview Widget
                    </Button>
                  </div>
                </div>
              ) : deploymentStatus === 'failed' ? (
                <div className="space-y-4">
                  <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-sm">Deployment Failed</h3>
                      <p className="text-sm mt-1">
                        There was a problem generating your widget. Please try again or contact support.
                      </p>
                    </div>
                  </div>
                  <Button onClick={retryDeployment} className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry Deployment
                  </Button>
                </div>
              ) : (
                <div>
                  {deploymentStatus === 'deploying' ? (
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        <span>Generating widget code...</span>
                      </div>
                      <Progress value={deploymentProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {deploymentProgress < 30 ? "Setting up widget configurations..." : 
                         deploymentProgress < 60 ? "Applying customizations..." : 
                         deploymentProgress < 90 ? "Finalizing widget..." : 
                         "Almost done..."}
                      </p>
                    </div>
                  ) : (
                    <Button onClick={simulateDeployment} className="w-full">
                      <PanelRightClose className="mr-2 h-4 w-4" />
                      Deploy Widget
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DeploymentWizard;
