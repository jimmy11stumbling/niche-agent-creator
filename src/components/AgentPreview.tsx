
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Settings, Bot } from "lucide-react";

interface AgentPreviewProps {
  agent: {
    name: string;
    description: string;
    niche: string;
    personality: string;
    systemPrompt: string;
    exampleConversations: string;
    isModelDownloaded: boolean;
  };
}

const AgentPreview = ({ agent }: AgentPreviewProps) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: `Hello! I'm ${agent.name || 'Your AI Assistant'}. ${agent.description ? agent.description : "How can I help you today?"}` }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    setMessages([...messages, { role: 'user', content: newMessage }]);
    
    // Simulate AI response
    setTimeout(() => {
      let response = "I'm still learning based on the instructions you provide. Once you complete my configuration, I'll be able to respond more effectively!";
      
      if (agent.systemPrompt) {
        if (agent.niche === "fitness") {
          response = "Based on your fitness goals, I recommend starting with a balanced routine of cardio and strength training. Would you like me to suggest a specific workout plan?";
        } else if (agent.niche === "finance") {
          response = "I'd recommend reviewing your budget and identifying areas where you can reduce expenses. Have you set up an emergency fund yet?";
        } else if (agent.niche === "cooking") {
          response = "That recipe sounds delicious! I suggest adding fresh herbs at the end for more flavor. Would you like alternative ingredient suggestions?";
        } else {
          response = "I understand your question. Based on my knowledge in " + (agent.niche || "this area") + ", I'd suggest exploring different approaches. Would you like more specific advice?";
        }
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1000);
    
    setNewMessage("");
  };

  return (
    <Tabs defaultValue="chat">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="chat">Chat Preview</TabsTrigger>
        <TabsTrigger value="config">Configuration</TabsTrigger>
      </TabsList>
      
      <TabsContent value="chat" className="fade-in">
        <Card className="border shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {agent.name ? agent.name.charAt(0).toUpperCase() : "AI"}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">{agent.name || "AI Assistant"}</CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="h-[340px] overflow-y-auto pb-0">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="pt-4">
            <div className="flex w-full items-center space-x-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={!agent.isModelDownloaded}
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                disabled={!agent.isModelDownloaded}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
        
        {!agent.isModelDownloaded && (
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Download the model to enable interactive chat preview
          </p>
        )}
      </TabsContent>
      
      <TabsContent value="config" className="space-y-4 fade-in">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center">
              <Settings className="mr-2 h-4 w-4" />
              <CardTitle className="text-base">Agent Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Name</h4>
              <p className="text-sm text-muted-foreground">
                {agent.name || "Not set"}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">Niche</h4>
              <p className="text-sm text-muted-foreground">
                {agent.niche || "Not set"}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">Description</h4>
              <p className="text-sm text-muted-foreground">
                {agent.description || "Not set"}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">Personality</h4>
              <p className="text-sm text-muted-foreground">
                {agent.personality || "Not set"}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium">System Prompt</h4>
              <p className="text-sm text-muted-foreground">
                {agent.systemPrompt || "Not set"}
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AgentPreview;
