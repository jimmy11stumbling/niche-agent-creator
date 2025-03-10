
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Brain, MessageSquare, LayoutDashboard, User, Code, Database, ChevronDown, ChevronUp, Settings, Clock, BookOpen, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

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
    createdAt?: Date;
    updatedAt?: Date;
    version?: string;
    metrics?: {
      conversations?: number;
      messagesProcessed?: number;
      avgResponseTime?: number;
      successRate?: number;
    };
    knowledgeSources?: {
      name: string;
      type: string;
      documentCount?: number;
      lastUpdated?: Date;
    }[];
  };
}

const AgentConfig = ({ agent }: AgentConfigProps) => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    personality: true,
    technical: true,
    data: true,
    metrics: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatDate = (date?: Date) => {
    if (!date) return "Not specified";
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <ScrollArea className="border rounded-md h-[450px] p-4">
      <div className="space-y-6">
        {/* Basic Information Section */}
        <div>
          <h3 
            className="text-lg font-medium flex items-center justify-between mb-2 cursor-pointer"
            onClick={() => toggleSection('basic')}
          >
            <span className="flex items-center">
              <Brain className="mr-2 h-5 w-5 text-primary" />
              Basic Information
            </span>
            {expandedSections.basic ? 
              <ChevronUp className="h-4 w-4 text-muted-foreground" /> : 
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            }
          </h3>
          
          {expandedSections.basic && (
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
              {agent.version && (
                <div>
                  <h4 className="text-sm font-medium">Version</h4>
                  <p className="text-sm text-muted-foreground">
                    v{agent.version}
                  </p>
                </div>
              )}
              {(agent.createdAt || agent.updatedAt) && (
                <div>
                  <h4 className="text-sm font-medium">Timeline</h4>
                  <div className="text-xs text-muted-foreground">
                    {agent.createdAt && (
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        Created: {formatDate(agent.createdAt)}
                      </div>
                    )}
                    {agent.updatedAt && (
                      <div className="flex items-center mt-0.5">
                        <Clock className="h-3 w-3 mr-1" />
                        Last updated: {formatDate(agent.updatedAt)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Personality & Behavior Section */}
        <div>
          <h3 
            className="text-lg font-medium flex items-center justify-between mb-2 cursor-pointer"
            onClick={() => toggleSection('personality')}
          >
            <span className="flex items-center">
              <User className="mr-2 h-5 w-5 text-primary" />
              Personality & Behavior
            </span>
            {expandedSections.personality ? 
              <ChevronUp className="h-4 w-4 text-muted-foreground" /> : 
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            }
          </h3>
          
          {expandedSections.personality && (
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
          )}
        </div>

        <Separator />

        {/* Technical Configuration Section */}
        <div>
          <h3 
            className="text-lg font-medium flex items-center justify-between mb-2 cursor-pointer"
            onClick={() => toggleSection('technical')}
          >
            <span className="flex items-center">
              <Code className="mr-2 h-5 w-5 text-primary" />
              Technical Configuration
            </span>
            {expandedSections.technical ? 
              <ChevronUp className="h-4 w-4 text-muted-foreground" /> : 
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            }
          </h3>
          
          {expandedSections.technical && (
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
          )}
        </div>

        <Separator />

        {/* Data Integration Section */}
        <div>
          <h3 
            className="text-lg font-medium flex items-center justify-between mb-2 cursor-pointer"
            onClick={() => toggleSection('data')}
          >
            <span className="flex items-center">
              <Database className="mr-2 h-5 w-5 text-primary" />
              Data Integration
            </span>
            {expandedSections.data ? 
              <ChevronUp className="h-4 w-4 text-muted-foreground" /> : 
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            }
          </h3>
          
          {expandedSections.data && (
            <div className="space-y-2 ml-7">
              <div>
                <h4 className="text-sm font-medium">Knowledge Sources</h4>
                {agent.knowledgeSources && agent.knowledgeSources.length > 0 ? (
                  <div className="space-y-1 mt-1">
                    {agent.knowledgeSources.map((source, index) => (
                      <div key={index} className="text-xs flex items-center justify-between bg-secondary/20 p-1.5 rounded">
                        <div className="flex items-center">
                          <BookOpen className="h-3 w-3 mr-1" />
                          <span>{source.name}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            {source.type}
                          </Badge>
                        </div>
                        {source.documentCount && (
                          <span className="text-muted-foreground">
                            {source.documentCount} docs
                          </span>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full mt-2 text-xs h-7">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Knowledge Source
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No custom data sources connected
                  </p>
                )}
              </div>
              <div>
                <h4 className="text-sm font-medium">Context Window</h4>
                <p className="text-sm text-muted-foreground">
                  Standard (4K tokens)
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Performance Metrics Section */}
        {agent.metrics && (
          <>
            <Separator />
            
            <div>
              <h3 
                className="text-lg font-medium flex items-center justify-between mb-2 cursor-pointer"
                onClick={() => toggleSection('metrics')}
              >
                <span className="flex items-center">
                  <Settings className="mr-2 h-5 w-5 text-primary" />
                  Performance Metrics
                </span>
                {expandedSections.metrics ? 
                  <ChevronUp className="h-4 w-4 text-muted-foreground" /> : 
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                }
              </h3>
              
              {expandedSections.metrics && (
                <div className="space-y-4 ml-7">
                  {agent.metrics.conversations !== undefined && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-sm font-medium">Total Conversations</h4>
                        <span className="text-sm font-medium">{agent.metrics.conversations}</span>
                      </div>
                    </div>
                  )}
                  
                  {agent.metrics.messagesProcessed !== undefined && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-sm font-medium">Messages Processed</h4>
                        <span className="text-sm font-medium">{agent.metrics.messagesProcessed}</span>
                      </div>
                    </div>
                  )}
                  
                  {agent.metrics.avgResponseTime !== undefined && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-sm font-medium">Average Response Time</h4>
                        <span className="text-sm font-medium">{agent.metrics.avgResponseTime.toFixed(2)}s</span>
                      </div>
                    </div>
                  )}
                  
                  {agent.metrics.successRate !== undefined && (
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-sm font-medium">Success Rate</h4>
                        <span className="text-sm font-medium">{agent.metrics.successRate}%</span>
                      </div>
                      <Progress value={agent.metrics.successRate} className="h-2" />
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
};

export default AgentConfig;
