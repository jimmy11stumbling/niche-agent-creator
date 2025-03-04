
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, FileText, Video, Code } from "lucide-react";

const TutorialsPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-2">Tutorials</h1>
        <p className="text-muted-foreground mb-8">
          Learn how to use AgentCreator with step-by-step tutorials and guides
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Getting Started Tutorial */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                Getting Started with AgentCreator
              </CardTitle>
              <CardDescription>Learn the basics of creating your first AI agent</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This tutorial walks you through the process of creating your first AI agent, from choosing a model to testing your finished agent.</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                <FileText className="h-4 w-4" />
                <span>10 min read</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Read Tutorial</Button>
            </CardFooter>
          </Card>

          {/* Creating Advanced Workflows */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Creating Advanced Workflows
              </CardTitle>
              <CardDescription>Master workflow creation with complex task sequences</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Learn how to design and implement advanced workflows with multiple task types, conditions, and data processing capabilities.</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                <Video className="h-4 w-4" />
                <span>15 min video</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Watch Tutorial</Button>
            </CardFooter>
          </Card>

          {/* Data Processing with AgentCreator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Data Processing with AgentCreator
              </CardTitle>
              <CardDescription>Process and transform data for your agents</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Discover how to use the data processing features to prepare, transform, and validate data for training your AI agents.</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                <FileText className="h-4 w-4" />
                <span>20 min code-along</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Start Tutorial</Button>
            </CardFooter>
          </Card>

          {/* Deploying Your Agent */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Deploying Your Agent
              </CardTitle>
              <CardDescription>Learn different deployment options and best practices</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This tutorial covers all the available deployment options for your agent, including web integration, API access, and custom deployments.</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                <Video className="h-4 w-4" />
                <span>12 min video</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Watch Tutorial</Button>
            </CardFooter>
          </Card>

          {/* Custom Agent Personality */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Customizing Agent Personality
              </CardTitle>
              <CardDescription>Create unique agent personalities and behaviors</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Learn techniques for customizing your agent's personality, tone, and communication style to match your brand or use case.</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                <FileText className="h-4 w-4" />
                <span>8 min read</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Read Tutorial</Button>
            </CardFooter>
          </Card>

          {/* Working with APIs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Working with APIs
              </CardTitle>
              <CardDescription>Connect your agent to external services</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This hands-on tutorial shows you how to integrate your agent with external APIs to enhance its capabilities and functionality.</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                <Code className="h-4 w-4" />
                <span>15 min code-along</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Start Tutorial</Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TutorialsPage;
