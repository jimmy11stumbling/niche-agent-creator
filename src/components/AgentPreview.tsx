
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Settings, Bot, User, Sparkles, Code, Lightbulb, MessageSquare } from "lucide-react";

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

  const handleSendMessage = () => {
    if (!newMessage.trim() || !agent.isModelDownloaded) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: newMessage }]);
    setNewMessage("");
    setIsTyping(true);
    
    // Simulate AI response based on agent configuration
    const timer = setTimeout(() => {
      let response = "";
      
      // Generate a more customized response based on agent configuration
      if (agent.systemPrompt) {
        if (agent.niche.toLowerCase().includes("fitness")) {
          response = generateFitnessResponse(newMessage);
        } else if (agent.niche.toLowerCase().includes("finance")) {
          response = generateFinanceResponse(newMessage);
        } else if (agent.niche.toLowerCase().includes("cook") || agent.niche.toLowerCase().includes("food")) {
          response = generateCookingResponse(newMessage);
        } else if (agent.niche.toLowerCase().includes("code") || agent.niche.toLowerCase().includes("program")) {
          response = generateCodingResponse(newMessage);
        } else {
          response = generateGenericResponse(newMessage, agent.niche);
        }
      } else {
        response = "I'm still learning based on the instructions you provide. Once you complete my configuration, I'll be able to respond more effectively!";
      }
      
      // Add personality traits to the response if provided
      if (agent.personality) {
        if (agent.personality.toLowerCase().includes("friendly")) {
          response += " 😊 Let me know if you need anything else!";
        } else if (agent.personality.toLowerCase().includes("professional")) {
          response = "Based on my analysis: " + response + " Please let me know if you require further assistance.";
        } else if (agent.personality.toLowerCase().includes("humor")) {
          response += " And hey, that's just my two cents - though with inflation, it might be worth a bit less now! 😉";
        }
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  };
  
  // Helper functions to generate domain-specific responses
  const generateFitnessResponse = (userMessage: string) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    if (lowerCaseMessage.includes("workout") || lowerCaseMessage.includes("exercise")) {
      return "Based on your fitness goals, I recommend a balanced routine of cardio and strength training. For optimal results, aim for 3-4 strength sessions and 2-3 cardio sessions per week, with adequate rest days in between. Would you like me to suggest a specific workout plan?";
    } else if (lowerCaseMessage.includes("diet") || lowerCaseMessage.includes("nutrition")) {
      return "Nutrition is 80% of your fitness journey! Focus on whole foods, lean proteins, complex carbs, and healthy fats. For your specific goals, I'd recommend tracking your macronutrients and staying hydrated. Would you like a sample meal plan?";
    } else {
      return "From a fitness perspective, consistency is key. Make small, sustainable changes to your routine and diet that you can maintain long-term. Remember that rest and recovery are just as important as the workouts themselves. How can I help you get started?";
    }
  };
  
  const generateFinanceResponse = (userMessage: string) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    if (lowerCaseMessage.includes("invest") || lowerCaseMessage.includes("stock")) {
      return "When it comes to investing, diversification is crucial for managing risk. I'd recommend starting with a mix of index funds, bonds, and possibly some individual stocks if you're comfortable with research. Have you considered what your risk tolerance and time horizon are?";
    } else if (lowerCaseMessage.includes("budget") || lowerCaseMessage.includes("save")) {
      return "I'd recommend reviewing your spending and creating a detailed budget. The 50/30/20 rule is a good starting point: 50% for necessities, 30% for wants, and 20% for savings and debt repayment. Have you already identified areas where you might be able to reduce expenses?";
    } else {
      return "Financial health starts with having a clear understanding of your current situation. Let's start by examining your income, expenses, debts, and savings. From there, we can create a tailored plan to help you reach your financial goals. What specific aspect of your finances would you like to focus on?";
    }
  };
  
  const generateCookingResponse = (userMessage: string) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    if (lowerCaseMessage.includes("recipe") || lowerCaseMessage.includes("make")) {
      return "That recipe sounds delicious! For the best results, make sure to use fresh ingredients and proper technique. I recommend adding fresh herbs at the end for more vibrant flavor. Would you like alternative ingredient suggestions or tips on preparation methods?";
    } else if (lowerCaseMessage.includes("ingredient") || lowerCaseMessage.includes("substitute")) {
      return "You can substitute ingredients based on what you have available. For example, yogurt can replace sour cream, honey can replace sugar (use 3/4 the amount), and different vegetables with similar cooking times can be swapped. What specific ingredient are you looking to replace?";
    } else {
      return "Cooking is both an art and a science! For better results, try balancing flavors (sweet, salty, sour, bitter, umami) and textures in your dishes. Also, properly preheating your pan and not overcrowding it will help you achieve better browning and flavor development. What kind of dish are you planning to cook?";
    }
  };
  
  const generateCodingResponse = (userMessage: string) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    if (lowerCaseMessage.includes("error") || lowerCaseMessage.includes("bug")) {
      return "Based on the error description, this sounds like it could be a scope issue or possibly an asynchronous operation that's not completing as expected. I'd recommend adding some console.log statements to track the variable state throughout execution, and make sure any promises or callbacks are being handled correctly. Can you share the specific error message you're receiving?";
    } else if (lowerCaseMessage.includes("learn") || lowerCaseMessage.includes("start")) {
      return "For beginners in programming, I recommend starting with Python or JavaScript due to their readable syntax and widespread use. Focus on understanding core concepts like variables, data types, control flow, and functions before moving to more complex topics. Would you prefer interactive tutorials, video courses, or project-based learning?";
    } else {
      return "When designing your software architecture, consider the SOLID principles to create maintainable and scalable code. Break down the problem into smaller, reusable components, and think about how data will flow through your application. What specific functionality are you trying to implement?";
    }
  };
  
  const generateGenericResponse = (userMessage: string, niche: string) => {
    return `I understand your question about ${userMessage.split(' ').slice(0, 3).join(' ')}... Based on my knowledge in ${niche || "this area"}, I'd suggest exploring different approaches to address this. The key factors to consider are timing, resources, and your specific goals. Would you like me to elaborate on any particular aspect?`;
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
              <h4 className="text-sm font-medium flex items-center">
                <Bot className="h-4 w-4 mr-1 text-primary" />
                Name
              </h4>
              <p className="text-sm text-muted-foreground">
                {agent.name || "Not set"}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium flex items-center">
                <Sparkles className="h-4 w-4 mr-1 text-primary" />
                Niche
              </h4>
              <p className="text-sm text-muted-foreground">
                {agent.niche || "Not set"}
              </p>
              {agent.niche && (
                <div className="mt-1">
                  <Badge variant="outline" className="text-xs">
                    {agent.niche}
                  </Badge>
                </div>
              )}
            </div>
            
            <div>
              <h4 className="text-sm font-medium flex items-center">
                <Lightbulb className="h-4 w-4 mr-1 text-primary" />
                Description
              </h4>
              <p className="text-sm text-muted-foreground">
                {agent.description || "Not set"}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium flex items-center">
                <User className="h-4 w-4 mr-1 text-primary" />
                Personality
              </h4>
              <p className="text-sm text-muted-foreground">
                {agent.personality || "Not set"}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium flex items-center">
                <Code className="h-4 w-4 mr-1 text-primary" />
                System Prompt
              </h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {agent.systemPrompt || "Not set"}
              </p>
            </div>
            
            {agent.exampleConversations && (
              <div>
                <h4 className="text-sm font-medium flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1 text-primary" />
                  Example Conversations
                </h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {agent.exampleConversations}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AgentPreview;
