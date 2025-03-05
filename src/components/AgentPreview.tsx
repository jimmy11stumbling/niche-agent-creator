
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AgentChat from "./agent/AgentChat";
import AgentConfig from "./agent/AgentConfig";

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
  };
}

const AgentPreview = ({ agent }: AgentPreviewProps) => {
  return (
    <Tabs defaultValue="chat">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="chat">Chat Preview</TabsTrigger>
        <TabsTrigger value="config">Configuration</TabsTrigger>
      </TabsList>
      
      <TabsContent value="chat" className="fade-in">
        <AgentChat agent={agent} />
      </TabsContent>
      
      <TabsContent value="config" className="space-y-4 fade-in">
        <AgentConfig agent={agent} />
      </TabsContent>
    </Tabs>
  );
};

export default AgentPreview;
