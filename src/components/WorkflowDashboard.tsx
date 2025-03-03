
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PlusIcon,
  SearchIcon,
  PlayIcon,
  PauseIcon,
  HistoryIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "lucide-react";
import { Workflow, WorkflowExecution } from "@/types/workflow";

// Mock API function - in a real app, this would be replaced with actual API calls
const mockFetchWorkflows = async (): Promise<Workflow[]> => {
  return [
    {
      id: "wf1",
      name: "Customer Onboarding",
      description: "Process new customer registration and welcome emails",
      tasks: [],
      transitions: [],
      createdAt: "2023-05-15T10:30:00Z",
      updatedAt: "2023-06-10T14:45:00Z",
      version: 3
    },
    {
      id: "wf2",
      name: "Order Processing",
      description: "Handle new orders from checkout to fulfillment",
      tasks: [],
      transitions: [],
      createdAt: "2023-04-20T09:15:00Z",
      updatedAt: "2023-06-12T11:20:00Z",
      version: 5
    },
    {
      id: "wf3",
      name: "Data Sync Automation",
      description: "Synchronize data between CRM and marketing platforms",
      tasks: [],
      transitions: [],
      createdAt: "2023-05-28T16:00:00Z",
      updatedAt: "2023-06-01T08:30:00Z",
      version: 2
    }
  ];
};

const mockFetchExecutions = async (): Promise<WorkflowExecution[]> => {
  return [
    {
      id: "exec1",
      workflowId: "wf1",
      workflowVersion: 3,
      status: "Completed",
      startTime: "2023-06-12T10:30:00Z",
      endTime: "2023-06-12T10:32:45Z",
      tasks: []
    },
    {
      id: "exec2",
      workflowId: "wf2",
      workflowVersion: 5,
      status: "Running",
      startTime: "2023-06-12T14:20:00Z",
      tasks: []
    },
    {
      id: "exec3",
      workflowId: "wf3",
      workflowVersion: 2,
      status: "Failed",
      startTime: "2023-06-12T11:45:00Z",
      endTime: "2023-06-12T11:46:30Z",
      tasks: []
    },
    {
      id: "exec4",
      workflowId: "wf1",
      workflowVersion: 3,
      status: "Completed",
      startTime: "2023-06-11T09:15:00Z",
      endTime: "2023-06-11T09:17:20Z",
      tasks: []
    }
  ];
};

const WorkflowDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("workflows");
  
  // Check if we have an execution ID in the URL
  const executionId = searchParams.get("execution");
  
  // Fetch workflows
  const { data: workflows = [], isLoading: isLoadingWorkflows } = useQuery({
    queryKey: ['workflows'],
    queryFn: mockFetchWorkflows
  });
  
  // Fetch executions
  const { data: executions = [], isLoading: isLoadingExecutions } = useQuery({
    queryKey: ['executions'],
    queryFn: mockFetchExecutions
  });
  
  // Filter workflows based on search query
  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter executions based on search query
  const filteredExecutions = executions.filter(execution => {
    const workflow = workflows.find(w => w.id === execution.workflowId);
    return (
      workflow?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      execution.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  // Handle creating a new workflow
  const handleCreateWorkflow = () => {
    navigate("/workflows/designer");
  };
  
  // Handle editing a workflow
  const handleEditWorkflow = (workflowId: string) => {
    navigate(`/workflows/designer/${workflowId}`);
  };
  
  // Handle running a workflow
  const handleRunWorkflow = (workflowId: string) => {
    toast.success(`Started workflow execution for: ${workflowId}`);
    // In a real app, this would call an API to start the workflow
    navigate(`/workflows?execution=${workflowId}`);
  };
  
  // Handle viewing execution details
  const handleViewExecution = (executionId: string) => {
    // In a real app, this would navigate to a detailed execution view
    toast.info(`Viewing execution details: ${executionId}`);
  };
  
  // Render workflows tab
  const renderWorkflowsTab = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="relative w-80">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search workflows..."
              className="pl-10"
            />
          </div>
          <Button onClick={handleCreateWorkflow}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Workflow
          </Button>
        </div>
        
        {isLoadingWorkflows ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4">Loading workflows...</p>
            </div>
          </div>
        ) : filteredWorkflows.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10">
                <HistoryIcon className="mx-auto h-10 w-10 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No workflows found</h3>
                <p className="text-gray-500 mt-2">
                  {searchQuery
                    ? "Try a different search term"
                    : "Create your first workflow to get started"}
                </p>
                {!searchQuery && (
                  <Button onClick={handleCreateWorkflow} className="mt-4">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Workflow
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkflows.map(workflow => (
              <Card key={workflow.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle>{workflow.name}</CardTitle>
                  <CardDescription>{workflow.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-500 mb-4">
                    <div className="flex justify-between">
                      <span>Version:</span>
                      <span className="font-medium">{workflow.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last updated:</span>
                      <span className="font-medium">
                        {format(new Date(workflow.updatedAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditWorkflow(workflow.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleRunWorkflow(workflow.id)}
                    >
                      <PlayIcon className="h-4 w-4 mr-1" />
                      Run
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // Render executions tab
  const renderExecutionsTab = () => {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="relative w-80">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search executions..."
              className="pl-10"
            />
          </div>
        </div>
        
        {isLoadingExecutions ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4">Loading executions...</p>
            </div>
          </div>
        ) : filteredExecutions.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10">
                <HistoryIcon className="mx-auto h-10 w-10 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No executions found</h3>
                <p className="text-gray-500 mt-2">
                  {searchQuery
                    ? "Try a different search term"
                    : "Run a workflow to see executions here"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Workflow</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExecutions.map(execution => {
                    const workflow = workflows.find(w => w.id === execution.workflowId);
                    const startTime = new Date(execution.startTime);
                    const endTime = execution.endTime ? new Date(execution.endTime) : new Date();
                    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
                    
                    return (
                      <TableRow 
                        key={execution.id}
                        className={executionId === execution.id ? "bg-primary/5" : ""}
                      >
                        <TableCell>
                          <div className="flex items-center">
                            {execution.status === "Running" && (
                              <ClockIcon className="h-4 w-4 text-blue-500 mr-2" />
                            )}
                            {execution.status === "Completed" && (
                              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                            )}
                            {execution.status === "Failed" && (
                              <XCircleIcon className="h-4 w-4 text-red-500 mr-2" />
                            )}
                            {execution.status === "Cancelled" && (
                              <PauseIcon className="h-4 w-4 text-yellow-500 mr-2" />
                            )}
                            {execution.status}
                          </div>
                        </TableCell>
                        <TableCell>
                          {workflow?.name || execution.workflowId}
                          <div className="text-xs text-gray-500">
                            Version: {execution.workflowVersion}
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(startTime, "MMM d, yyyy HH:mm:ss")}
                        </TableCell>
                        <TableCell>
                          {execution.status === "Running" 
                            ? "In progress" 
                            : `${duration} seconds`}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewExecution(execution.id)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Workflow Dashboard</h1>
        <p className="text-gray-500">
          Manage and monitor your automated workflows
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="executions">Executions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="workflows">
          {renderWorkflowsTab()}
        </TabsContent>
        
        <TabsContent value="executions">
          {renderExecutionsTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowDashboard;
