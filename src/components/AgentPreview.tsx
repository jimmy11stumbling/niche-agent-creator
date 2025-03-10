
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AgentChat from "./agent/AgentChat";
import AgentConfig from "./agent/AgentConfig";
import AgentOptionsPanel from "./agent/AgentOptionsPanel";
import { Brain, MessageSquare, FileCode, Settings } from "lucide-react";

interface AgentPreviewProps {
  agent: {
    name: string;
    description: string;
    niche: string;
    personality: string;
    systemPrompt: string;
    exampleConversations: string;
    isModelDownloaded: boolean;
    useDemoMode?: boolean;
    generateResponse?: (userPrompt: string) => Promise<string>;
    selectedModel?: string;
    selectedVoiceId?: string;
    deploymentMethod?: string;
  };
}

const AgentPreview = ({ agent }: AgentPreviewProps) => {
  const [currentAgent, setCurrentAgent] = useState(agent);
  
  const handleUpdateAgent = (updates: Partial<typeof agent>) => {
    setCurrentAgent(prev => ({ ...prev, ...updates }));
  };

  return (
    <Tabs defaultValue="chat">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="chat" className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          Chat Preview
        </TabsTrigger>
        <TabsTrigger value="config" className="flex items-center gap-1">
          <FileCode className="h-4 w-4" />
          Configuration
        </TabsTrigger>
        <TabsTrigger value="options" className="flex items-center gap-1">
          <Settings className="h-4 w-4" />
          Options
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="chat" className="fade-in">
        <AgentChat agent={currentAgent} />
      </TabsContent>
      
      <TabsContent value="config" className="space-y-4 fade-in">
        <AgentConfig agent={currentAgent} />
      </TabsContent>
      
      <TabsContent value="options" className="space-y-4 fade-in">
        <AgentOptionsPanel 
          agent={currentAgent}
          onUpdateAgent={handleUpdateAgent}
        />
      </TabsContent>
    </Tabs>
  );
};

export default AgentPreview;
