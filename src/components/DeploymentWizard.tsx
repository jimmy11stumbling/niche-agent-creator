
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Rocket, 
  Globe, 
  Code, 
  PanelRightClose, 
  Copy, 
  CheckCircle, 
  RefreshCw,
  ExternalLink
} from "lucide-react";

interface DeploymentWizardProps {
  agent: {
    name: string;
    niche: string;
    deploymentMethod: string;
  };
}

const DeploymentWizard = ({ agent }: DeploymentWizardProps) => {
  const { toast } = useToast();
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success'>('idle');
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [deploymentUrl, setDeploymentUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [widgetCode, setWidgetCode] = useState("");
  const [deploymentSettings, setDeploymentSettings] = useState({
    customDomain: "",
    allowUserFeedback: true,
    enableAnalytics: true,
  });

  const simulateDeployment = () => {
    setDeploymentStatus('deploying');
    setDeploymentProgress(0);
    
    const interval = setInterval(() => {
      setDeploymentProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDeploymentStatus('success');
          
          // Generate mock deployment URL
          const slugifiedName = agent.name.toLowerCase().replace(/\s+/g, '-');
          const mockUrl = `https://${slugifiedName}.example.com`;
          setDeploymentUrl(mockUrl);
          
          // Generate mock API key
          setApiKey(`sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`);
          
          // Generate mock widget code
          setWidgetCode(`<script src="https://cdn.ai-agents.com/widget.js" id="ai-agent-widget" data-agent-id="${Math.random().toString(36).substring(2, 10)}"></script>`);
          
          toast({
            title: "Deployment Successful",
            description: "Your AI agent has been deployed and is ready to use.",
          });
          
          return 100;
        }
        return prev + 5;
      });
    }, 300);
  };

  const copyToClipboard = (text: string, successMessage: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: successMessage,
      });
    });
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Rocket className="mr-2 h-5 w-5" />
          Deploy "{agent.name}"
        </CardTitle>
        <CardDescription>
          Deploy your AI agent and make it available to users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={agent.deploymentMethod}>
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
                  onChange={(e) => setDeploymentSettings({...deploymentSettings, customDomain: e.target.value})}
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank to use our default domain
                </p>
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
                </div>
              ) : (
                <div>
                  {deploymentStatus === 'deploying' ? (
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        <span>Deploying your AI agent...</span>
                      </div>
                      <Progress value={deploymentProgress} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        This may take a few minutes
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
                        This may take a few minutes
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
                        <code className="bg-secondary p-1 rounded">data-theme="light"</code>
                        <span className="text-xs">Widget theme (light or dark)</span>
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
  data-theme="light"
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
  data-theme="light"
  data-icon="true"
></script>`, "Example code copied to clipboard")}
                    >
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy Example
                    </Button>
                  </div>
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
                        This may take a few minutes
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
