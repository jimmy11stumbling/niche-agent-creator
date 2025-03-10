
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Send, User } from "lucide-react";

interface Message {
  role: "user" | "agent";
  content: string;
}

interface AgentChatProps {
  agent: {
    name: string;
    description: string;
    niche: string;
    personality: string;
    isModelDownloaded: boolean;
    useDemoMode?: boolean;
    generateResponse?: (userPrompt: string) => Promise<string>;
  };
}

const AgentChat = ({ agent }: AgentChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "agent",
      content: `Hello! I'm ${agent.name || "your AI assistant"}${agent.niche ? ` specializing in ${agent.niche}` : ""}. How can I help you today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: "user" as const, content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      let response = "I'm still configuring my knowledge base. Please try again soon!";
      
      if (agent.generateResponse) {
        response = await agent.generateResponse(userMessage.content);
      } else if (agent.useDemoMode) {
        // Fallback demo responses if generateResponse is not provided
        if (agent.niche?.toLowerCase().includes("finance")) {
          response = "Based on financial best practices, I'd recommend reviewing your budget allocations and considering diversified investments to optimize your returns.";
        } else if (agent.niche?.toLowerCase().includes("fitness")) {
          response = "For your fitness goals, consistency is key. I'd recommend a balanced routine combining strength training, cardio, and proper recovery periods.";
        } else {
          response = `As ${agent.name || "your assistant"}, I'm here to help with your ${agent.niche || "questions"}. Could you provide more details about what you're looking for?`;
        }
      }
      
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: "agent", content: response }]);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: "I encountered an error. Please try again." },
      ]);
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[450px] border rounded-md overflow-hidden">
      <div className="p-3 border-b bg-secondary/30">
        <h3 className="font-medium flex items-center">
          <Brain className="h-4 w-4 mr-2" />
          {agent.name || "AI Assistant"}
          {!agent.isModelDownloaded && agent.useDemoMode && (
            <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
              Demo Mode
            </span>
          )}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-1">{agent.description}</p>
      </div>
      
      <ScrollArea className="flex-1 p-3 bg-secondary/10">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.role === "agent" ? (
                    <Brain className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="text-xs font-medium">
                    {message.role === "user" ? "You" : agent.name || "Assistant"}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-secondary">
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span className="text-xs font-medium">
                    {agent.name || "Assistant"}
                  </span>
                </div>
                <div className="mt-2 flex space-x-1">
                  <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                  <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AgentChat;
