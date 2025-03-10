
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Brain, MessageSquare, LayoutDashboard, User, Code, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AgentConfigProps {
  agent: {
    name: string;
    description: string;
    niche: string;
    personality: string;
    systemPrompt: string;
    exampleConversations: string;
    isModelDownloaded: boolean;
    selectedModel?: string;
    useDemoMode?: boolean;
    deploymentMethod?: string;
  };
}

const AgentConfig = ({ agent }: AgentConfigProps) => {
  return (
    <ScrollArea className="border rounded-md h-[450px] p-4">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium flex items-center mb-2">
            <Brain className="mr-2 h-5 w-5 text-primary" />
            Basic Information
          </h3>
          <div className="space-y-2 ml-7">
            <div>
              <h4 className="text-sm font-medium">Name</h4>
              <p className="text-sm text-muted-foreground">
                {agent.name || "Not specified"}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Niche</h4>
              <p className="text-sm text-muted-foreground flex items-center">
                {agent.niche || "Not specified"}
                {agent.niche && (
                  <Badge variant="outline" className="ml-2">
                    {agent.niche}
                  </Badge>
                )}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Description</h4>
              <p className="text-sm text-muted-foreground">
                {agent.description || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium flex items-center mb-2">
            <User className="mr-2 h-5 w-5 text-primary" />
            Personality & Behavior
          </h3>
          <div className="space-y-2 ml-7">
            <div>
              <h4 className="text-sm font-medium">Personality Traits</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {agent.personality || "Not specified"}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">System Prompt</h4>
              <div className="text-sm text-muted-foreground bg-secondary/30 p-2 rounded-md mt-1 max-h-32 overflow-auto">
                <pre className="whitespace-pre-wrap font-sans text-xs">
                  {agent.systemPrompt || "Not specified"}
                </pre>
              </div>
            </div>
            {agent.exampleConversations && (
              <div>
                <h4 className="text-sm font-medium">Example Conversations</h4>
                <div className="text-sm text-muted-foreground bg-secondary/30 p-2 rounded-md mt-1 max-h-32 overflow-auto">
                  <pre className="whitespace-pre-wrap font-sans text-xs">
                    {agent.exampleConversations}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium flex items-center mb-2">
            <Code className="mr-2 h-5 w-5 text-primary" />
            Technical Configuration
          </h3>
          <div className="space-y-2 ml-7">
            <div>
              <h4 className="text-sm font-medium">Selected Model</h4>
              <p className="text-sm text-muted-foreground">
                {agent.selectedModel || "Not specified"}
                {agent.useDemoMode && (
                  <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                    Demo Mode
                  </span>
                )}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Model Status</h4>
              <p className="text-sm text-muted-foreground flex items-center">
                {agent.isModelDownloaded ? (
                  <>
                    <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                    Downloaded and Ready
                  </>
                ) : agent.useDemoMode ? (
                  <>
                    <span className="h-2 w-2 bg-yellow-500 rounded-full mr-2"></span>
                    Using Demo Mode (Simulated Responses)
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
                    Not Downloaded
                  </>
                )}
              </p>
            </div>
            {agent.deploymentMethod && (
              <div>
                <h4 className="text-sm font-medium">Deployment Method</h4>
                <p className="text-sm text-muted-foreground">
                  {agent.deploymentMethod === "web" && "Web Application"}
                  {agent.deploymentMethod === "api" && "API Endpoint"}
                  {agent.deploymentMethod === "widget" && "Embeddable Widget"}
                </p>
              </div>
            )}
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-lg font-medium flex items-center mb-2">
            <Database className="mr-2 h-5 w-5 text-primary" />
            Data Integration
          </h3>
          <div className="space-y-2 ml-7">
            <div>
              <h4 className="text-sm font-medium">Knowledge Sources</h4>
              <p className="text-sm text-muted-foreground">
                No custom data sources connected
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Context Window</h4>
              <p className="text-sm text-muted-foreground">
                Standard (4K tokens)
              </p>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default AgentConfig;
