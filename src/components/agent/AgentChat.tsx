import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User } from "lucide-react";
import { generateFallbackResponse } from "./AgentResponseGenerator";

interface AgentChatProps {
  agent: {
    name: string;
    description: string;
    niche: string;
    isModelDownloaded?: boolean;
    useDemoMode?: boolean;
    generateResponse?: (userPrompt: string) => Promise<string>;
  };
}

const AgentChat: React.FC<AgentChatProps> = ({ agent }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Initialize with greeting from the agent
    const greeting = `Hello! I'm ${agent.name || 'Your AI Assistant'}. ${agent.description ? agent.description : "How can I help you today?"}`;
    setMessages([{ role: 'assistant', content: greeting }]);
  }, [agent.name, agent.description]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: newMessage }]);
    const userInput = newMessage;
    setNewMessage("");
    setIsTyping(true);
    
    try {
      let response;
      
      // Use agent's generateResponse function if available
      if (agent.generateResponse) {
        response = await agent.generateResponse(userInput);
      } else {
        // Otherwise use the fallback response generator
        response = await generateFallbackResponse(userInput, agent.niche);
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm having trouble generating a response right now. Please try again later." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {agent.name ? agent.name.charAt(0).toUpperCase() : "AI"}
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-lg">{agent.name || "AI Assistant"}</CardTitle>
          {agent.useDemoMode && (
            <Badge variant="outline" className="ml-2 text-xs">Demo Mode</Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="h-[340px] pb-0">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-start max-w-[80%]">
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8 mr-2 mt-1 hidden sm:block">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {agent.name ? agent.name.charAt(0).toUpperCase() : "AI"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8 ml-2 mt-1 hidden sm:block">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start max-w-[80%]">
                  <Avatar className="h-8 w-8 mr-2 mt-1 hidden sm:block">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {agent.name ? agent.name.charAt(0).toUpperCase() : "AI"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg px-4 py-2 bg-secondary">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 bg-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 bg-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 bg-foreground/60 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="pt-4">
        <div className="flex w-full items-center space-x-2">
          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button 
            size="icon" 
            onClick={handleSendMessage}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AgentChat;
