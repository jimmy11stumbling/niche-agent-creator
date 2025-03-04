
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ApiReferencePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">API Reference</h1>
        
        <Tabs defaultValue="authentication">
          <TabsList className="mb-6">
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="agents">Agents</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>
          
          <TabsContent value="authentication">
            <Card>
              <CardHeader>
                <CardTitle>Authentication API</CardTitle>
                <CardDescription>Learn how to authenticate with the AgentCreator API</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-xl font-medium">API Keys</h3>
                <p>All API requests must be authenticated using an API key. You can generate an API key in your AgentCreator dashboard.</p>
                
                <h3 className="text-xl font-medium">Authentication Methods</h3>
                <p>There are two ways to authenticate with the API:</p>
                
                <h4 className="text-lg font-medium">1. Bearer Token (Recommended)</h4>
                <p>Include your API key in the Authorization header:</p>
                <pre className="bg-slate-200 p-3 rounded-md overflow-x-auto">
{`curl -X GET https://api.agentcreator.com/v1/agents \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                </pre>
                
                <h4 className="text-lg font-medium">2. Query Parameter</h4>
                <p>Include your API key as a query parameter:</p>
                <pre className="bg-slate-200 p-3 rounded-md overflow-x-auto">
{`curl -X GET https://api.agentcreator.com/v1/agents?api_key=YOUR_API_KEY`}
                </pre>
                
                <h3 className="text-xl font-medium">API Rate Limits</h3>
                <p>The API has the following rate limits:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Free tier:</strong> 100 requests per hour</li>
                  <li><strong>Professional tier:</strong> 1,000 requests per hour</li>
                  <li><strong>Enterprise tier:</strong> 10,000 requests per hour</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="agents">
            <Card>
              <CardHeader>
                <CardTitle>Agents API</CardTitle>
                <CardDescription>Endpoints for managing and interacting with agents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-xl font-medium">List Agents</h3>
                <pre className="bg-slate-200 p-3 rounded-md overflow-x-auto">
{`GET /v1/agents

Response:
{
  "agents": [
    {
      "id": "agent_123",
      "name": "Customer Support Agent",
      "description": "Handles customer inquiries",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-02T00:00:00Z",
      "status": "active"
    }
  ]
}`}
                </pre>
                
                <h3 className="text-xl font-medium">Create Agent</h3>
                <pre className="bg-slate-200 p-3 rounded-md overflow-x-auto">
{`POST /v1/agents
{
  "name": "Sales Assistant",
  "description": "Helps with product sales",
  "model": "gpt-4",
  "parameters": {
    "temperature": 0.7,
    "max_tokens": 1000
  }
}

Response:
{
  "id": "agent_456",
  "name": "Sales Assistant",
  "description": "Helps with product sales",
  "created_at": "2023-01-03T00:00:00Z",
  "updated_at": "2023-01-03T00:00:00Z",
  "status": "inactive"
}`}
                </pre>
                
                <h3 className="text-xl font-medium">Chat with Agent</h3>
                <pre className="bg-slate-200 p-3 rounded-md overflow-x-auto">
{`POST /v1/agents/{agent_id}/chat
{
  "message": "Hello, I need help finding a product.",
  "conversation_id": "conv_123"
}

Response:
{
  "response": "Hello! I'd be happy to help you find a product. What kind of product are you looking for?",
  "conversation_id": "conv_123"
}`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="workflows">
            <Card>
              <CardHeader>
                <CardTitle>Workflows API</CardTitle>
                <CardDescription>Endpoints for managing workflows and tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-xl font-medium">Create Workflow</h3>
                <pre className="bg-slate-200 p-3 rounded-md overflow-x-auto">
{`POST /v1/workflows
{
  "name": "Data Processing Workflow",
  "description": "Processes and analyzes customer data",
  "tasks": [
    {
      "id": "task_1",
      "name": "Fetch Data",
      "type": "Action",
      "actionType": "HttpRequest",
      "parameters": {
        "url": "https://api.example.com/data",
        "method": "GET"
      },
      "position": { "x": 100, "y": 100 }
    }
  ],
  "transitions": []
}

Response:
{
  "id": "workflow_123",
  "name": "Data Processing Workflow",
  "description": "Processes and analyzes customer data",
  "created_at": "2023-01-04T00:00:00Z",
  "updated_at": "2023-01-04T00:00:00Z",
  "version": 1
}`}
                </pre>
                
                <h3 className="text-xl font-medium">Execute Workflow</h3>
                <pre className="bg-slate-200 p-3 rounded-md overflow-x-auto">
{`POST /v1/workflows/{workflow_id}/execute
{
  "input_data": {
    "customer_id": "cust_123"
  }
}

Response:
{
  "execution_id": "exec_123",
  "status": "Running",
  "start_time": "2023-01-04T00:10:00Z"
}`}
                </pre>
                
                <h3 className="text-xl font-medium">Get Workflow Execution</h3>
                <pre className="bg-slate-200 p-3 rounded-md overflow-x-auto">
{`GET /v1/workflows/executions/{execution_id}

Response:
{
  "id": "exec_123",
  "workflow_id": "workflow_123",
  "status": "Completed",
  "start_time": "2023-01-04T00:10:00Z",
  "end_time": "2023-01-04T00:11:00Z",
  "tasks": [
    {
      "task_id": "task_1",
      "status": "Completed",
      "start_time": "2023-01-04T00:10:05Z",
      "end_time": "2023-01-04T00:10:30Z"
    }
  ],
  "output_data": {
    "processed_data": {
      "customer_name": "John Doe",
      "sentiment_score": 0.8
    }
  }
}`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Data API</CardTitle>
                <CardDescription>Endpoints for managing and processing data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-xl font-medium">Upload Data</h3>
                <pre className="bg-slate-200 p-3 rounded-md overflow-x-auto">
{`POST /v1/data/upload
Content-Type: multipart/form-data

Form Parameters:
- file: The file to upload
- data_type: The type of data (e.g., "training", "knowledge_base")
- description: A description of the data

Response:
{
  "data_id": "data_123",
  "filename": "customer_data.csv",
  "data_type": "training",
  "size_bytes": 1024,
  "created_at": "2023-01-05T00:00:00Z"
}`}
                </pre>
                
                <h3 className="text-xl font-medium">Process Data</h3>
                <pre className="bg-slate-200 p-3 rounded-md overflow-x-auto">
{`POST /v1/data/{data_id}/process
{
  "output_format": "json",
  "transformations": [
    {
      "type": "normalize",
      "fields": ["text"]
    },
    {
      "type": "filter",
      "condition": "length(text) > 10"
    }
  ],
  "validation": {
    "required_fields": ["customer_id", "text"],
    "patterns": {
      "email": "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$"
    }
  }
}

Response:
{
  "processing_id": "proc_123",
  "status": "Processing",
  "start_time": "2023-01-05T00:05:00Z"
}`}
                </pre>
                
                <h3 className="text-xl font-medium">Get Processing Status</h3>
                <pre className="bg-slate-200 p-3 rounded-md overflow-x-auto">
{`GET /v1/data/processing/{processing_id}

Response:
{
  "id": "proc_123",
  "data_id": "data_123",
  "status": "Completed",
  "start_time": "2023-01-05T00:05:00Z",
  "end_time": "2023-01-05T00:06:00Z",
  "statistics": {
    "records_processed": 100,
    "records_filtered": 5,
    "validation_errors": 0
  },
  "output_url": "https://api.agentcreator.com/v1/data/download/proc_123"
}`}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default ApiReferencePage;
