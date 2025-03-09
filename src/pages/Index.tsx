
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TemplatesGallery from "@/components/TemplatesGallery";
import { Brain, Sparkles, Zap, LineChart, Code, Globe, Shield, ChevronRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 gradient-bg">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 slide-in">
              Create Custom AI Agents <span className="gradient-text">for Any Niche</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto fade-in">
              Build, customize, and deploy AI agents powered by Llama 3.2 language models. No coding required.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 fade-in">
              <Button asChild size="lg" className="text-md">
                <Link to="/create-agent">
                  <Brain className="mr-2 h-5 w-5" />
                  Create Your Agent
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-md">
                <Link to="/templates">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Explore Templates
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Powerful Features</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
              Everything you need to create, customize, and deploy AI agents for your specific use case
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-6">
                <Zap className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Custom Personalities</h3>
                <p className="text-muted-foreground">
                  Define your agent's personality, tone, and behavior to match your brand and niche.
                </p>
              </div>
              
              <div className="glass-card p-6">
                <LineChart className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Specialized Knowledge</h3>
                <p className="text-muted-foreground">
                  Create agents with deep expertise in specific domains from finance to fitness.
                </p>
              </div>
              
              <div className="glass-card p-6">
                <Code className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">No Coding Required</h3>
                <p className="text-muted-foreground">
                  Our intuitive interface makes it easy to create and customize your AI agents without any technical skills.
                </p>
              </div>
              
              <div className="glass-card p-6">
                <Globe className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Multiple Deployment Options</h3>
                <p className="text-muted-foreground">
                  Deploy your agent as a web app, API, or embeddable widget for your website.
                </p>
              </div>
              
              <div className="glass-card p-6">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Privacy-Focused</h3>
                <p className="text-muted-foreground">
                  Your agent runs locally or in your private cloud, keeping your data secure and private.
                </p>
              </div>
              
              <div className="glass-card p-6">
                <Sparkles className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Template Library</h3>
                <p className="text-muted-foreground">
                  Start with pre-built templates for common use cases and customize to your needs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Templates Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Popular Templates</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
              Jump-start your agent creation with these pre-configured templates
            </p>
            
            <TemplatesGallery onSelectTemplate={() => {}} />
            
            <div className="text-center mt-12">
              <Button asChild variant="outline">
                <Link to="/templates">
                  View All Templates
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Create Your Custom AI Agent?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start building your specialized AI assistant in minutes with our easy-to-use platform.
            </p>
            <Button asChild size="lg">
              <Link to="/create-agent">
                Get Started Now
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
