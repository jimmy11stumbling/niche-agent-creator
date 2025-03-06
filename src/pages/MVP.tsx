
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Workflow,
  Code,
  MessageSquare,
  FileText,
  Bot,
  Globe,
  Cpu,
  Zap,
  Check,
  ChevronRight,
} from "lucide-react";

const MVPPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
            Early Access MVP
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
            Create Custom AI Agents & Automated Workflows
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Build specialized AI agents for any niche and connect them with powerful workflows - 
            all without writing a single line of code.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8"
              onClick={() => navigate("/create-agent")}
            >
              Create AI Agent
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8"
              onClick={() => navigate("/workflows")}
            >
              Build Workflow
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10" />
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Key Capabilities</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our platform combines powerful AI agent creation with flexible workflow automation
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border border-primary/20 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Specialized AI Agents</CardTitle>
                <CardDescription>
                  Create custom AI agents trained for specific niches and tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Finance, legal, health, marketing experts</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Custom personalities and knowledge areas</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Powerful LLM integration</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => navigate("/create-agent")}
                >
                  Create Agent
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
            
            {/* Feature 2 */}
            <Card className="border border-primary/20 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Workflow className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Visual Workflow Builder</CardTitle>
                <CardDescription>
                  Design complex automation flows with our intuitive visual editor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Drag-and-drop workflow designer</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Conditional branching and decision paths</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Multi-step process automation</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => navigate("/workflows")}
                >
                  Build Workflow
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
            
            {/* Feature 3 */}
            <Card className="border border-primary/20 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Integration & Deployment</CardTitle>
                <CardDescription>
                  Multiple ways to deploy and integrate your AI solutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Web application deployment</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>API endpoints for integration</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Embeddable widgets for your website</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => navigate("/deploy/example")}
                >
                  View Deployment Options
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Use Cases */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Use Cases</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            See how our platform can be used to create powerful AI solutions for various domains
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Use Case 1 */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="mb-2">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Legal Assistant</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>Create specialized legal AI assistants to handle common legal questions and document review.</p>
              </CardContent>
            </Card>
            
            {/* Use Case 2 */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="mb-2">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Customer Support</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>Build AI agents that handle common customer inquiries and automate support workflows.</p>
              </CardContent>
            </Card>
            
            {/* Use Case 3 */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="mb-2">
                  <Code className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Coding Assistant</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>Create specialized programming assistants for different languages and frameworks.</p>
              </CardContent>
            </Card>
            
            {/* Use Case 4 */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="mb-2">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Content Creation</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>Build AI workflows for creating, editing and publishing content across platforms.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-background to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our early access program and start building your own custom AI solutions today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8"
              onClick={() => navigate("/create-agent")}
            >
              Create Your First AI Agent
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8"
              onClick={() => navigate("/templates")}
            >
              Browse Templates
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default MVPPage;
