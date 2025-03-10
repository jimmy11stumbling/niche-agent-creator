
import { useState, useRef, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Send, User, Info, Bot, AlertCircle, Clipboard, Share2, Download, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Message {
  role: "user" | "agent";
  content: string;
  timestamp?: Date;
  status?: "sending" | "sent" | "error";
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
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "agent",
      content: `Hello! I'm ${agent.name || "your AI assistant"}${agent.niche ? ` specializing in ${agent.niche}` : ""}. How can I help you today?`,
      timestamp: new Date(),
      status: "sent"
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
    if (messages.length > 1 && !isInViewport(messagesEndRef.current)) {
      setHasUnreadMessages(true);
    }
  }, [messages, isLoading]);

  // Focus input when component mounts
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }, []);

  const isInViewport = (element: HTMLElement | null): boolean => {
    if (!element || !scrollAreaRef.current) return false;
    const rect = element.getBoundingClientRect();
    const scrollRect = scrollAreaRef.current.getBoundingClientRect();
    return rect.bottom <= scrollRect.bottom;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setHasUnreadMessages(false);
  };

  const simulateTypingEffect = async (response: string) => {
    setIsTyping(true);
    
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, { 
          role: "agent", 
          content: response, 
          timestamp: new Date(),
          status: "sent"
        }]);
        setIsTyping(false);
        resolve();
      }, Math.min(800, response.length * 5)); // Dynamic delay based on response length
    });
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { 
      role: "user" as const, 
      content: input.trim(),
      timestamp: new Date(),
      status: "sending" as const
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      let response = "I'm still configuring my knowledge base. Please try again soon!";
      
      // First add the user message with "sending" status
      setMessages((prev) => 
        prev.map(msg => 
          msg === userMessage ? { ...msg, status: "sent" } : msg
        )
      );
      
      if (agent.generateResponse) {
        try {
          response = await agent.generateResponse(userMessage.content);
        } catch (error) {
          console.error("Error in generateResponse:", error);
          throw error;
        }
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
      
      setIsLoading(false);
      await simulateTypingEffect(response);
      
      toast({
        title: "Response Generated",
        description: agent.useDemoMode ? "Using demo mode (simulated response)" : "AI response generated",
        variant: "default",
      });
    } catch (error) {
      console.error("Error generating response:", error);
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        { 
          role: "agent", 
          content: "I encountered an error. Please try again.",
          timestamp: new Date(),
          status: "error"
        },
      ]);
      
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const copyConversation = () => {
    const conversationText = messages
      .map(message => `${message.role === "user" ? "You" : agent.name || "Assistant"}: ${message.content}`)
      .join('\n\n');
    
    navigator.clipboard.writeText(conversationText);
    
    toast({
      title: "Conversation Copied",
      description: "The entire conversation has been copied to your clipboard.",
    });
  };

  const handleScrollAreaClick = () => {
    if (isTyping || isLoading) return;
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-[450px] border rounded-md overflow-hidden">
      <div className="p-3 border-b bg-secondary/30">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium flex items-center">
            <Brain className="h-4 w-4 mr-2" />
            {agent.name || "AI Assistant"}
            {!agent.isModelDownloaded && agent.useDemoMode && (
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                Demo Mode
              </span>
            )}
          </h3>
          <div className="flex space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copyConversation}>
                    <Clipboard className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy Conversation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="font-medium">Share Conversation</h4>
                        <p className="text-sm text-muted-foreground">
                          You can share this conversation as a link or export it as a file.
                        </p>
                        <div className="flex space-x-2 mt-2">
                          <Button size="sm" className="w-full">
                            Create Link
                          </Button>
                          <Button size="sm" variant="outline" className="w-full">
                            <Download className="h-4 w-4 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share Conversation</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1">{agent.description}</p>
      </div>
      
      <div ref={scrollAreaRef} className="flex-1 relative" onClick={handleScrollAreaClick}>
        <ScrollArea className="h-full p-3 bg-secondary/10">
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
                      : message.status === "error" 
                        ? "bg-destructive/10 border border-destructive/20" 
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
                    <span className="text-xs text-muted-foreground ml-auto">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.status === "error" && (
                    <div className="mt-1 flex items-center text-xs text-destructive">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Error generating response
                    </div>
                  )}
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
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-3 bg-secondary">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    <span className="text-xs font-medium">
                      {agent.name || "Assistant"}
                    </span>
                  </div>
                  <div className="mt-2 flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-current animate-pulse" />
                    <div className="h-2 w-2 rounded-full bg-current animate-pulse [animation-delay:0.2s]" />
                    <div className="h-2 w-2 rounded-full bg-current animate-pulse [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {hasUnreadMessages && (
          <Button 
            size="sm" 
            className="absolute bottom-3 right-3 shadow-md rounded-full h-8 pl-2 pr-3 bg-primary/90 hover:bg-primary"
            onClick={scrollToBottom}
          >
            <ArrowDown className="h-4 w-4 mr-1" />
            New messages
          </Button>
        )}
      </div>
      
      <div className="p-3 border-t">
        {agent.useDemoMode && (
          <div className="mb-2 text-xs flex items-center text-yellow-600 bg-yellow-50 p-1 rounded">
            <Info className="h-3 w-3 mr-1" />
            Demo mode: Responses are simulated
          </div>
        )}
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading || isTyping}
            className="flex-1"
            ref={inputRef}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading || isTyping}
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Send message</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

export default AgentChat;
