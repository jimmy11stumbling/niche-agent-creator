
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const DocumentationPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Documentation</h1>
        
        <Tabs defaultValue="getting-started">
          <TabsList className="mb-6">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
          </TabsList>
          
          <TabsContent value="getting-started">
            <Card>
              <CardHeader>
                <CardTitle>Getting Started with AgentCreator</CardTitle>
                <CardDescription>Learn the basics of building AI agents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-xl font-medium">Introduction</h3>
                <p>AgentCreator is a powerful platform that allows you to create custom AI agents for any purpose. This documentation will guide you through the process of creating, customizing, and deploying your own agents.</p>
                
                <h3 className="text-xl font-medium">Prerequisites</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Basic understanding of AI concepts</li>
                  <li>Familiarity with natural language processing</li>
                  <li>Data for training your agent (optional)</li>
                </ul>
                
                <h3 className="text-xl font-medium">Installation</h3>
                <p>AgentCreator is a web-based platform, so there's no installation required. Simply sign up for an account and you're ready to start creating agents.</p>
                
                <h3 className="text-xl font-medium">Creating Your First Agent</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Navigate to the "Create" page</li>
                  <li>Select a base model from the available options</li>
                  <li>Upload your training data or use one of our templates</li>
                  <li>Configure your agent's parameters</li>
                  <li>Train and test your agent</li>
                  <li>Deploy your agent to production</li>
                </ol>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="workflows">
            <Card>
              <CardHeader>
                <CardTitle>Working with Workflows</CardTitle>
                <CardDescription>Create and manage advanced workflow pipelines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-xl font-medium">Workflow Basics</h3>
                <p>Workflows allow you to create complex sequences of tasks that your agent can execute. A workflow consists of various tasks, such as actions, conditions, triggers, and subworkflows, connected by transitions.</p>
                
                <h3 className="text-xl font-medium">Task Types</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Trigger:</strong> Initiates a workflow based on a schedule or event</li>
                  <li><strong>Action:</strong> Performs a specific operation, such as making an HTTP request or processing data</li>
                  <li><strong>Condition:</strong> Evaluates a logical expression to determine the flow path</li>
                  <li><strong>SubWorkflow:</strong> Executes another workflow as part of the current workflow</li>
                </ul>
                
                <h3 className="text-xl font-medium">Action Types</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>HTTP Request:</strong> Makes API calls to external services</li>
                  <li><strong>Database Operation:</strong> Interacts with databases</li>
                  <li><strong>Message Queue:</strong> Sends messages to queues</li>
                  <li><strong>Script Execution:</strong> Runs custom code</li>
                  <li><strong>Data Processing:</strong> Processes and transforms data files</li>
                </ul>
                
                <h3 className="text-xl font-medium">Data Processing Features</h3>
                <p>The Data Processing action supports multiple data sources and transformation techniques:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Data Sources:</strong> CSV, JSON, XML, TXT, PDF, or API endpoints</li>
                  <li><strong>Transformations:</strong> Normalize text, filter data, augment data</li>
                  <li><strong>Validation:</strong> Apply custom validation rules to ensure data quality</li>
                  <li><strong>Output Formats:</strong> Export processed data as JSON, CSV, or XML</li>
                </ul>
                
                <h3 className="text-xl font-medium">Creating a Workflow</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Navigate to the "Workflows" page</li>
                  <li>Click "Create New Workflow" or select a template</li>
                  <li>Add tasks to your workflow using the sidebar</li>
                  <li>Configure each task's parameters</li>
                  <li>Connect tasks using transitions</li>
                  <li>Save and test your workflow</li>
                </ol>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="agents">
            <Card>
              <CardHeader>
                <CardTitle>Agent Configuration</CardTitle>
                <CardDescription>Learn about agent capabilities and customization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-xl font-medium">Agent Types</h3>
                <p>AgentCreator supports several types of AI agents, each with its own capabilities and use cases:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Conversational Agents:</strong> Chat with users naturally</li>
                  <li><strong>Task Agents:</strong> Execute specific tasks based on user input</li>
                  <li><strong>Knowledge Agents:</strong> Answer questions based on a knowledge base</li>
                  <li><strong>Workflow Agents:</strong> Orchestrate complex workflows</li>
                </ul>
                
                <h3 className="text-xl font-medium">Customizing Agents</h3>
                <p>You can customize your agents in several ways:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Personality:</strong> Adjust the tone and style of your agent's responses</li>
                  <li><strong>Knowledge:</strong> Provide domain-specific knowledge</li>
                  <li><strong>Capabilities:</strong> Enable specific features and integrations</li>
                  <li><strong>Workflows:</strong> Connect your agent to automated workflows</li>
                </ul>
                
                <h3 className="text-xl font-medium">Training and Fine-tuning</h3>
                <p>To improve your agent's performance, you can:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Data Training:</strong> Use custom datasets to train your agent</li>
                  <li><strong>Fine-tuning:</strong> Adjust model parameters for specific tasks</li>
                  <li><strong>Continuous Learning:</strong> Enable your agent to learn from interactions</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="deployment">
            <Card>
              <CardHeader>
                <CardTitle>Deployment Options</CardTitle>
                <CardDescription>Learn how to deploy and integrate your agents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-xl font-medium">Deployment Methods</h3>
                <p>AgentCreator offers several deployment options for your agents:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Web Integration:</strong> Embed your agent in a website</li>
                  <li><strong>API Access:</strong> Access your agent via REST API</li>
                  <li><strong>Mobile SDK:</strong> Integrate your agent in mobile apps</li>
                  <li><strong>Custom Deployment:</strong> Deploy to your infrastructure</li>
                </ul>
                
                <h3 className="text-xl font-medium">API Integration</h3>
                <p>The AgentCreator API allows you to interact with your agents programmatically:</p>
                <pre className="bg-slate-200 p-3 rounded-md">
{`// Example API request
fetch('https://api.agentcreator.com/agents/your-agent-id/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    message: 'Hello, agent!'
  })
})
.then(response => response.json())
.then(data => console.log(data))`}
                </pre>
                
                <h3 className="text-xl font-medium">Monitoring and Maintenance</h3>
                <p>Once deployed, you can monitor and maintain your agent:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Analytics Dashboard:</strong> View usage statistics and performance metrics</li>
                  <li><strong>Conversation Logs:</strong> Review interactions with users</li>
                  <li><strong>Updates:</strong> Publish new versions of your agent</li>
                  <li><strong>A/B Testing:</strong> Test different agent configurations</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default DocumentationPage;
